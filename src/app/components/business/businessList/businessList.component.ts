import { Component, Input, Output, NgZone, Injectable } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import { ControlGroup, FormBuilder, Control, NgControlGroup } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { DATEPICKER_DIRECTIVES, PAGINATION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import { BusinessApi, BusinessList, BusinessListResponse } from 'client';
import { PaginationComponent } from 'common';
import { MissionService, ThzsUtil } from 'services';

@Component({
  selector: 'business-list',
  template: require('./businessList.html'),
  styles: [require('./businessList.scss')],
  directives: [DATEPICKER_DIRECTIVES, ROUTER_DIRECTIVES, PaginationComponent],
  providers: [HTTP_PROVIDERS, BusinessApi, ThzsUtil],
  // host: {
  //   '(click)': 'closeDatePicker($event)'
  // }
})

export class BusinessListComponent {
  list: BusinessList;
  today: Date = moment().toDate();
  date: Date = moment().toDate();
  page: any = {};
  dateShow: boolean = false;
  timeout: any;
  shopChangeSub: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private bApi: BusinessApi, private missionService: MissionService, private thzsUtil: ThzsUtil) {
    missionService.businessAddAnnounced$.subscribe(
      astronaut => {
        if (astronaut == 'business-list') {
          this.getList();
        }
      });
      console.log('blt', this.thzsUtil);

      this.shopChangeSub = this.thzsUtil.shopChanged$.subscribe( item => {
          console.log('business list: ', item);
      } );
      console.log('bl: ', this.shopChangeSub)
      
  }

  // 初始化
  ngOnInit() {
    this.getList();
    
    
      
  }

  onToggleDate(event) {
    event.stopPropagation();
    this.dateShow = !this.dateShow;
  }

  public closeDatePicker(event) {
    event.stopPropagation();
    this.dateShow = false;
  }

  moment(date,format='') {
    return moment(date).format(format||'YYYY-MM-DD');
  }


  onPickerChange(event) {
    this.date = event;
    this.getList();
  }

  onLastDate() {
    this.date = moment(this.date).subtract(1, 'days').toDate();
    this.getList();
  }

  onNextDate() {
    this.date = moment(this.date).add(1, 'days').toDate();
    this.getList();
  }

  isToday(){
    return moment(this.date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
  }

  onOpen() {
    console.log('onOpen');
  }

  onClose() {
    this.getList();
  }

  changePage(event) {
    this.page.current = event.page;
    this.getList();
  }

  getList() {
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      this.bApi.businessListGet(this.moment(this.date), this.page.current).subscribe(data => {
        if (data.meta.code === 200) {
          this.list = data.data;
          this.page.current = data.meta.current || 1;
          this.page.limit = data.meta.limit || 20;
          this.page.total = data.meta.total || 0;
        }
      })
    }, 500)
  }

  onOpenBusinessAdd() {
    this.missionService.confirmBusinessAdd({ selector: 'business-list' });
  }
}
