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
import { MainLogoComponent, PageFooterComponent, NavbarComponent, MenusComponent, SearchBarComponent } from 'common';
import { EmployeeFormComponent } from '../employeeForm/employeeForm.component';


@Component({
	moduleId: module.id,
	selector: 'employee-add',
	template: require('./employeeAdd.html'),
	styles: [require('./employeeAdd.scss')],
	directives: [ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent, EmployeeFormComponent, SearchBarComponent, PageFooterComponent],
	providers: [HTTP_PROVIDERS, UserApi, CommonApi, Md5, EmployeeApi ]
})

export class EmployeeAddComponent {
	employee: any;
	constructor(private router: Router, fb: FormBuilder, private route: ActivatedRoute, private uApi: UserApi, private cApi: CommonApi, private eApi: EmployeeApi) {
		this.employee = {
			name: '',
			code: '',
			mobile: ''
		}

	}


}
