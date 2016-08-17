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
import { MissionService } from 'services';

@Component({
	moduleId: module.id,
	selector: 'search-list',
	template: require('./searchList.html'),
	styles: [require('./searchList.scss')],
	directives: [ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent, SearchBarComponent, PageFooterComponent,PaginationComponent],
	providers: [HTTP_PROVIDERS, CustomerApi ]
})

export class SearchListComponent {
	customers: Customer[] = [];
	searchStr: string = '';
	isSearch: Boolean = false;
	sub: any;
	page: any = {};
	constructor(private cApi: CustomerApi, private route: ActivatedRoute, private router: Router,private missionService: MissionService) {

	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			console.log(params);
			this.searchStr = params['s'];
			console.log(this.searchStr);
			this.isSearch = this.searchStr === undefined || this.searchStr === '' || this.searchStr === null ? false : true;

			this.isSearch ?  this.getSearchCustomers() : this.getCustomers();
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	changePage(cur){
		this.page.current = event;
		this.searchStr === '' ? this.getCustomers() : this.getSearchCustomers();
	}

	getCustomers() {
		console.log('customer list....');
		this.cApi.customerListGet().subscribe(data => {
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
	getSearchCustomers() {
		console.log('customer search list....');
		if ( !this.isSearch ) return;
		this.cApi.customerSearchPhoneOrVehicleLicenceGet(this.searchStr).subscribe( data => {
			if (data.data) {
				let dd = data.data;
				if ( dd.length === 1 ) {
					this.router.navigate(['/dashbroad/customer-detail', { id: dd[0].id }]);
				} else {
					this.customers = dd;
					// this.onOpenba();
				}
				this.page.current = data.meta.current;
				this.page.limit = data.meta.limit;
				this.page.total = data.meta.total;
				this.page.pageTotal = Math.ceil(this.page.total / this.page.limit);
			} else {
				this.customers = [];
				// this.onOpenba();
			}
		}, err => {
			console.error(err);
			this.customers = [];
		});
	}

	onOpenba(){
		this.missionService.confirmBusinessAdd({ selector: 'search-list' });
	}

}
