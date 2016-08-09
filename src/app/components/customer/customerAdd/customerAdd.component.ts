import { Component, Input, Output, NgZone } from '@angular/core';
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

@Component({
	moduleId: module.id,
	selector: 'customer-add',
	template: require('./customerAdd.html'),
	styles: [require('./customerAdd.scss')],
	directives: [ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent, CustomerFormComponent, SearchBarComponent, PageFooterComponent],
	providers: [HTTP_PROVIDERS, UserApi, CommonApi, Md5, CustomerApi ]
})

export class CustomerAddComponent {
	customerFields: any;
	
	constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private cApi: CustomerApi) {
		
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

}