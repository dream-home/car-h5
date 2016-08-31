import { Component, Input, Output, NgZone, ViewChild } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {  ControlGroup, FormBuilder, Control } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { UserApi, CommonApi, CustomerApi, Customer } from 'client';
import { MainLogoComponent, PageFooterComponent, NavbarComponent, MenusComponent, SearchBarComponent } from 'common';
import { CustomerFormComponent } from '../customerForm/customerForm.component';
import { DialogService, ThzsUtil } from 'services';
@Component({
	moduleId: module.id,
	selector: 'customer-add',
	template: require('./customerAdd.html'),
	styles: [require('./customerAdd.scss')],
	directives: [ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent, CustomerFormComponent, SearchBarComponent, PageFooterComponent],
	providers: [HTTP_PROVIDERS, UserApi, CommonApi, Md5, CustomerApi, DialogService ]
})

export class CustomerAddComponent {
	customerFields: any;
	@ViewChild(CustomerFormComponent) cf: CustomerFormComponent;
	constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private cApi: CustomerApi, private dialogService: DialogService, private thzsUtil:ThzsUtil  ) {
	}

	ngOnInit() {
		this.customerFields = {
			'id': '',
			'vehicleLicence': '',
			'mobile': '',
			'vehicleFrame': '',
			'name': '',
			'birthYear': '',
			'gender': '',
			'vehicleBrand': '',
			'vehicleModel': '',
			'vehicleYear': '',
			'vehicleMiles': ''
		}
	}

	canDeactivate(): Observable<boolean> | boolean {
		if ( this.cf.hasChange() ) {
			return true;
		}
		let p = this.dialogService.confirm('当前页面尚有信息未保存，是否离开？');
		let o = Observable.fromPromise(p);
		this.thzsUtil.willChangePage = o;
		return o;
	}

}