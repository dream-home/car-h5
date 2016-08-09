import { Component, Input, Output, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {  ControlGroup, FormBuilder, Control } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { UserApi, CommonApi } from 'client';
import { MainLogoComponent, PageFooterComponent, NavbarComponent, MenusComponent, SearchBarComponent } from 'common';

@Component({
	moduleId: module.id,
	selector: 'my-account',
	template: require('./myAccount.html'),
	styles: [require('./myAccount.scss')],
	directives: [ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent, SearchBarComponent, PageFooterComponent],
	providers: [HTTP_PROVIDERS, UserApi, CommonApi, Md5 ]
})

export class MyAccountComponent {
	zone: any;
	accountBaseInfo: any;
	constructor(private router: Router, fb: FormBuilder, private route: ActivatedRoute, private uApi: UserApi, private cApi: CommonApi) {
		this.accountBaseInfo = {}
		
	}

	ngOnInit() {
		this.getAccountInfo();
		//this.getShopList();
	}
	

	getAccountInfo() {
		//let self = this;
		this.uApi.userMeGet().subscribe(data => {
			console.log(data);
			this.accountBaseInfo = data.data;
		}, err => {console.error(err); });
	}
	/*getShopList() {
		let self = this;
		this.shopApi.myshop().then(function(data) {
			self.accountBaseInfo.stores = data;
		}, function(data) {});
	}*/
}