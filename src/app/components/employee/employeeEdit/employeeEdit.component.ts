import { Component, Input, Output, NgZone, ViewChild } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {  ControlGroup, FormBuilder, Control } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { UserApi, CommonApi, EmployeeApi } from 'client';
import { MainLogoComponent, PageFooterComponent, NavbarComponent, MenusComponent, SearchBarComponent } from 'common';
import { EmployeeFormComponent } from '../employeeForm/employeeForm.component';
import { DialogService, ThzsUtil } from 'services';

@Component({
  moduleId: module.id,
  selector: 'employee-edit',
  template: require('./employeeEdit.html'),
  styles: [require('./employeeEdit.scss')],
  directives: [ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent, EmployeeFormComponent, SearchBarComponent, PageFooterComponent],
  providers: [HTTP_PROVIDERS, UserApi, CommonApi, Md5, EmployeeApi, DialogService]
})

export class EmployeeEditComponent {
  employee: any;
  id: string;
  sub: any;
  oldEmployee: string = '';
	@ViewChild(EmployeeFormComponent) ef: EmployeeFormComponent;
  constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private uApi: UserApi, private cApi: CommonApi, private eApi: EmployeeApi, private dialogService: DialogService, private thzsUtil: ThzsUtil) {
  }

  ngOnInit() {
    console.log('employee edit components init');
    this.employee = {
      id: '',
      name: '',
      code: '',
      mobile: ''
    };

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.eApi.employeeEmployeeIdGet('', this.id).subscribe(data => {
          console.log('edit', data);
          this.employee = data.data;
          this.oldEmployee = Md5.hashStr(JSON.stringify(this.employee), false).toString();
        }, err => {
          console.error(err);
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  canDeactivate(): Observable<boolean> | boolean {
		let current = Md5.hashStr(JSON.stringify(this.ef.employee), false).toString();
		if ( this.ef.hasSave || current === this.oldEmployee ) {
			return true;
		}
		let p = this.dialogService.confirm('当前页面尚有信息未保存，是否离开？');
		let o = Observable.fromPromise(p);
    this.thzsUtil.willChangePage = o;
		return o;
	}

}
