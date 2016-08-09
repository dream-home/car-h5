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
import { MainLogoComponent, PageFooterComponent, NavbarComponent, MenusComponent } from 'common';

@Component({
	moduleId: module.id,
	selector: 'report-week-business',
	template: require('./business.html'),
	styles: [require('./business.scss')],
	directives: [ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent],
	providers: [HTTP_PROVIDERS, UserApi, CommonApi, Md5 ]
})

export class ReportWeekBusinessComponent {

	constructor(private router: Router, fb: FormBuilder, private route: ActivatedRoute, private uApi: UserApi, private cApi: CommonApi) {
		
	}

	ngOnInit() {

	}



}
