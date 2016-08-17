import { Component, Input, Output, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {  ControlGroup, FormBuilder, Control } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { UserApi, CommonApi, EmployeeApi } from 'client';
import { MainLogoComponent, PageFooterComponent, NavbarComponent, MenusComponent, SearchBarComponent,PaginationComponent } from 'common';

@Component({
  moduleId: module.id,
  selector: 'employee-list',
  template: require('./employeeList.html'),
  styles: [require('./employeeList.scss')],
  directives: [ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent, SearchBarComponent, PageFooterComponent,PaginationComponent],
  providers: [HTTP_PROVIDERS, UserApi, CommonApi, Md5, EmployeeApi]
})

export class EmployeeListComponent {
  employeeList: any[] = [];
  deleteEmployee: any;
  winShow: number;
  page: any = {};
  constructor(private router: Router, fb: FormBuilder, private route: ActivatedRoute, private uApi: UserApi, private cApi: CommonApi, private eApi: EmployeeApi) {
    this.employeeList = [];
    this.deleteEmployee = null;
    this.winShow = 0;
  }

  ngOnInit() {
    this.list();
  }
  list() {
    this.eApi.employeeListGet(this.page.current).subscribe(data => {
      this.employeeList = data.data;
      this.page.current = data.meta.current;
      this.page.limit = data.meta.limit;
      this.page.total = data.meta.total;
      this.page.pageTotal = Math.ceil(this.page.total / this.page.limit);
    }, err => {
      console.error(err);
    });
  }

  changePage(cur) {
    this.page.current = cur.page;
    this.list();
  }

  onClose() {
    this.deleteEmployee = null;
    this.winShow = 0;
  }

  onAgreeDel() {
    this.eApi.employeeDeleteDelete(this.deleteEmployee.id).subscribe(data => {
      this.employeeList.splice(this.deleteEmployee.idx, 1);
      this.onClose();
    }, err => { });
  }

  onDel(employee, idx) {
    this.deleteEmployee = employee;
    this.deleteEmployee.idx = idx;
    this.winShow = 1;
  }






}
