import { Component, Input, Output, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {  ControlGroup, FormBuilder, Control } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { CustomerApi, Customer, BusinessDetail, BusinessHistoryDetail, BusinessApi } from 'client';
import { MainLogoComponent, PageFooterComponent, NavbarComponent, MenusComponent, SearchBarComponent, PaginationComponent } from 'common';
import { MissionService, ThzsUtil } from 'services';

@Component({
  moduleId: module.id,
  selector: 'customer-detail',
  template: require('./customerDetail.html'),
  styles: [require('./customerDetail.scss')],
  directives: [ROUTER_DIRECTIVES, NavbarComponent, MenusComponent, SearchBarComponent, PageFooterComponent, PaginationComponent],
  providers: [HTTP_PROVIDERS, CustomerApi, BusinessApi]
})

export class CustomerDetailComponent {
  customerId: number;
  customerDetail: any;
  customer: any = {};
  histories: any = [];
  showCommentWin: Boolean = false;
  showDelWin: Boolean = false;
  historyRecord: any = {};
  sendErr: any = {
    mobile: false,
    times: false
  };
  hasSend: Boolean = false;
  sendTimes: number = 0;
  tempMobile: string = '';
  sub: any;
  page: any = {};
  commentUrl = {
    qrCode: '',
    url: ''
  };
	delRecord:any;
  next:number;

  constructor(private router: Router, private route: ActivatedRoute, private cApi: CustomerApi, private bApi: BusinessApi, private missionService: MissionService, private thzsUtil: ThzsUtil) {
    missionService.businessAddAnnounced$.subscribe(
      astronaut => {
        if (astronaut == 'customer-detail') {
          this.getCustomerById(this.customerId);
        }
      });
      this.next = +window.localStorage.getItem('next');
  }

  onNext(index){
		this.next = index + 1;
		window.localStorage.setItem('next',String(this.next));
	}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.customerId = +params['id'];
      this.getCustomerById(this.customerId);
      if (!this.customerId) {
        this.router.navigate(['/dashbroad/customer-list']);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  changePage(cur) {
    this.page.current = cur.page;
    this.getCustomerById(this.customerId);
  }


  getCustomerById(id) {
    this.cApi.customerHistoryCustomerIdGet(id, this.page.current, this.page.limit).subscribe(data => {
      if (data.data) {
        this.customerDetail = data.data;
        // this.customer = this.customerDetail.customers.length ? this.customerDetail.customers[0] || [];
        this.customer = this.customerDetail.customers && this.customerDetail.customers.length ? this.customerDetail.customers[0] : {};
        this.histories = this.customerDetail.histories || [];
        this.customer = this.formatCustomer(this.customer);
        this.thzsUtil.getCustomerInfo(this.customer);
        this.customerDetail.historiesTotol = data.meta.total;
        this.customerDetail.totalAvgScore = this.customerDetail.totalAvgScore ? this.customerDetail.totalAvgScore.toFixed(2) : 0;
        // console.log('customerDetail: ', this.customerDetail);
        // console.log('customer: ', this.customer);
        // console.log('histories: ', this.histories);
        this.page.current = data.meta.current;
        this.page.limit = data.meta.limit;
        this.page.total = data.meta.total;
        this.page.pageTotal = Math.ceil(this.page.total / this.page.limit);
        console.log('page: ', this.page);
      } else {
        //啥都没有
        this.customerDetail = {};
      }
      console.log('customer: ', this.customer);
    }, err => console.error(err));
  }
  
  formatCustomer(customer) {
		const currentYear = (new Date()).getFullYear();
		customer.age = customer.birthYear ? (currentYear - customer.birthYear) : '';
		customer.sex = customer.gender === 0 ? '女' : customer.gender === 1 ? '男' : '';
		return customer;
	}


  // 显示评价弹出层
  onShowCommentWin(record) {
    this.showCommentWin = true;
    this.historyRecord = record;
    this.historyRecord.hasSend = record.hasSend ? record.hasSend : false;
    this.hasSend = this.historyRecord.hasSend;
    this.historyRecord.times = record.times ? record.times : false;
    this.sendErr.times = this.historyRecord.times;
    if (this.historyRecord.url) {
      this.commentUrl.qrCode = this.historyRecord.qrCode;
      this.commentUrl.url = this.historyRecord.url;
    } else {
      this.bApi.businessBusinessIdUrlGet(record.id).subscribe(data => {
        if (data.meta.code === 200) {
          this.commentUrl.qrCode = this.historyRecord.qrCode = data.data.qrCode;
          this.commentUrl.url = this.historyRecord.url = data.data.url;

        }

      }, err => console.error(err));
    }
    this.onNext(5);
  }

  // 关闭评价弹出层
  onCloseCommentWin() {
    this.showCommentWin = false;
    this.historyRecord = {};
    this.hasSend = false;
    this.sendErr.times = false;
    this.commentUrl.qrCode = this.historyRecord.qrCode;
    this.commentUrl.url = this.historyRecord.url;
    this.onNext(8);
    this.missionService.confirmMission('customer-detail');
  }

  // 通过手机号发送
  sendMobile() {
    let mobile = this.customer.mobile || this.tempMobile;
    mobile = mobile.trim();
    if (mobile === '' || !(/^(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/.test(mobile))) {
      this.sendErr.mobile = true;
      return;
    }
    console.log(mobile);
    // 成功
    const rnd = Math.floor(Math.random() * 9000 + 1000);
    const salt = 'thzs0708';
    let sign = Md5.hashStr(mobile + rnd + salt).toString();
    this.bApi.businessBusinessIdCommentPost(this.historyRecord.id, mobile, rnd + '', sign).subscribe(data => {
      console.log(data);
      if (data.meta && data.meta.code === 200) {
        this.hasSend = true;
        alert('发送成功');
      } else {
        if (data.error && data.error.code === 400401) {
          this.sendErr.times = true;
          this.historyRecord.times = true;
        }
        alert(data.error && data.error.message);
      }
    }, err => {
      console.error(err);
    });


  }

  onSend() {
    if (this.hasSend || this.sendErr.times) return false;
    this.sendMobile();
  }

  // 重新通过手机号发送
  onResend() {
    if (!this.hasSend || this.sendErr.times) return false;
    // 成功
    this.sendMobile();
  }

  // 评价弹出层电话输入框获取焦点
  onMobileFocus() {
    this.sendErr.mobile = false;
    this.sendErr.times = false;
  }

  onOpenBusinessAdd() {
    console.log('xxx', this.customer);
    this.missionService.confirmBusinessAdd({ selector: 'customer-detail', data: { vehicleLicence: this.customer.vehicleLicence, customerId: this.customer.id } });
  }

  onOpenBusinessEdit(data) {
    console.log('hs', data);
    data.vehicleLicence = this.customer.vehicleLicence;
    this.missionService.confirmBusinessAdd({ selector: 'customer-detail', data: data });
  }
	onDelBusiness(data) {
		this.delRecord = data;
  	this.showDelWin = true;
	}
  onDel() {
    this.bApi.businessDeleteDelete(this.delRecord.id).subscribe(data => {
      if (data.meta && data.meta.code === 200) {
        this.getCustomerById(this.customerId);
				this.onCancel();
      } else {
        alert(data.error && data.error.message);
      }
    }, err => {
      console.error(err);
    });
  }
  onCancel() {
    this.showDelWin = false;
  }

  

}
