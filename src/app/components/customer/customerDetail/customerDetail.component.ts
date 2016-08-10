import { Component, Input, Output, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {  ControlGroup, FormBuilder, Control } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { CustomerApi, Customer, BusinessDetail,BusinessHistoryDetail, BusinessApi } from 'client';
import { MainLogoComponent, PageFooterComponent, NavbarComponent, MenusComponent, SearchBarComponent,PaginationComponent } from 'common';
import { MissionService } from '../../../services';

@Component({
	moduleId: module.id,
	selector: 'customer-detail',
	template: require('./customerDetail.html'),
	styles: [require('./customerDetail.scss')],
	directives: [ROUTER_DIRECTIVES,NavbarComponent, MenusComponent, SearchBarComponent, PageFooterComponent,PaginationComponent],
	providers: [HTTP_PROVIDERS, CustomerApi, BusinessApi ]
})

export class CustomerDetailComponent {
	customerId: number;
	customerDetail: any;
	customer: any = {};
	histories: any = [];
	showCommentWin: Boolean = false;
	historyRecord: any = {};
	sendErr: any = {
		mobile: false,
		times: false
	};
	hasSend: Boolean = false;
	sendTimes: number = 0;
	tempMobile: string = '';
	sub:any;
	page:any = {};
	commentUrl = {
		qrCode: '',
		url: ''
	};
	constructor(private router: Router, private route: ActivatedRoute, private cApi: CustomerApi, private bApi: BusinessApi,private missionService: MissionService) {
		missionService.businessAddAnnounced$.subscribe(
		astronaut => {
			if(astronaut=='customer-detail'){
				this.getCustomerById(this.customerId);
			}
		});

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
    this.page.current = event;
    this.getCustomerById(this.customerId);
  }

	getCustomerById(id) {
		this.cApi.customerHistoryCustomerIdGet(id).subscribe(data => {
			if (data.data) {
				this.customerDetail = data.data;
				// this.customer = this.customerDetail.customers.length ? this.customerDetail.customers[0] || [];
				this.customer = this.customerDetail.customers && this.customerDetail.customers.length ? this.customerDetail.customers[0] : {} ;
				this.histories = this.customerDetail.histories || [];
				this.customer = this.formatCustomer(this.customer);
				this.customerDetail.historiesTotol = data.meta.total;
				this.customerDetail.totalAvgScore = this.customerDetail.totalAvgScore ? this.customerDetail.totalAvgScore.toFixed(2) : 0;
				// console.log('customerDetail: ', this.customerDetail);
				// console.log('customer: ', this.customer);
				// console.log('histories: ', this.histories);
				this.page.current = data.meta.current;
	      this.page.limit = data.meta.limit;
	      this.page.total = data.meta.total;
			} else {
				//啥都没有
				this.customerDetail = {};
			}
			console.log('customer: ', this.customer);
		}, err => console.error(err));
	}
	formatCustomer(customer) {
		const currentYear = (new Date()).getFullYear();
		const gender = parseInt(customer.gender||-1);
		customer.age = customer.birthYear ? (currentYear - customer.birthYear) : '';
		customer.sex = gender === 0 ? '女' : gender === 1 ? '男' : '其它';
		return customer;
	}

	// 显示评价弹出层
	onShowCommentWin(record) {
		this.showCommentWin = true;
		this.historyRecord = record;
		this.bApi.businessBusinessIdUrlGet(record.id).subscribe(data => {
			if (data.meta.code === 200) {
				this.commentUrl.qrCode = data.data.qrCode;
				this.commentUrl.url = data.data.url;
			}

		}, err => console.error(err));
		console.log('historyRecord', this.historyRecord) ;
	}

	// 关闭评价弹出层
	onCloseCommentWin() {
		this.showCommentWin = false;
		this.historyRecord = {};
		console.log('func onCloseCommentWin() called....');
	}

	// 通过手机号发送
	onSend() {
		let mobile = this.customer.mobile || this.tempMobile;
		mobile = mobile.trim();
		if (mobile === '' || !(/^(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/.test(mobile)) ) {
			this.sendErr.mobile = true;
			return;
		}
		console.log(mobile);
		// 成功
		const rnd = Math.floor(Math.random() * 9000 + 1000);
		const salt = 'thzs0708';
		let sign = Md5.hashStr(mobile + rnd + salt).toString();
		this.bApi.businessBusinessIdCommentPost(this.historyRecord.id, mobile, rnd + '', sign).subscribe( data => {
			console.log(data);
			if (data.meta && data.meta.code === 200) {
				this.hasSend = true;
				alert('发送成功');
			} else {
				alert(data.error && data.error.message);
			}
		}, err => {
			console.error(err);
		});


	}

	// 重新通过手机号发送
	onResend() {
		if (!this.hasSend) return false;
		// 成功
		this.onSend();
	}

	// 评价弹出层电话输入框获取焦点
	onMobileFocus() {
		this.sendErr.mobile = false;
		this.sendErr.times = false;
	}

	onOpenBusinessAdd(){
    this.missionService.confirmBusinessAdd({selector: 'customer-detail'});
  }


}
