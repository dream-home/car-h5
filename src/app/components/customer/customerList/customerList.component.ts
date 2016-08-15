import { Component, Input, Output, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {  ControlGroup, FormBuilder, Control } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import {  CustomerApi, Customer } from 'client';
import { MainLogoComponent, PageFooterComponent, NavbarComponent, MenusComponent, SearchBarComponent,PaginationComponent } from 'common';


@Component({
	moduleId: module.id,
	selector: 'customer-list',
	template: require('./customerList.html'),
	styles: [require('./customerList.scss')],
	directives: [ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent, SearchBarComponent, PageFooterComponent,PaginationComponent],
	providers: [HTTP_PROVIDERS, CustomerApi ]
})

export class CustomerListComponent {
	customers: Customer[] = [];
	searchStr: string = '';
	isSearch: Boolean = false;
	sub: any;
	page: any = {};
	constructor(private cApi: CustomerApi, private route: ActivatedRoute, private router: Router) {

	}

	ngOnInit() {
		this.getCustomers()
	}

	ngOnDestroy() {
		
	}

	changePage(cur){
		this.page.current = cur.page;
		this.getCustomers();
	}

	getCustomers() {
		console.log('customer list....');
		this.cApi.customerListGet(this.page.current,this.page.limit).subscribe(data => {
			this.customers = data.data && data.data.length ? data.data : [];
			console.log('customers: ', this.customers);
			this.page.current = data.meta.current;
			this.page.limit = data.meta.limit;
			this.page.total = data.meta.total;
			this.page.pageTotal = Math.ceil(this.page.total / this.page.limit);
		}, err => {
			console.error(err);
			this.customers = [];
		});
	}
	



}
