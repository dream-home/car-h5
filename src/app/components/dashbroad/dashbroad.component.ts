import { Component, Input, Output, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {  ControlGroup, FormBuilder, Control } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { UserApi, CommonApi } from 'client';
import { MainLogoComponent, PageFooterComponent, NavbarComponent, MenusComponent, SearchBarComponent, CrumbsComponent } from 'common';
import { BusinessAddComponent } from '../business/businessAdd/businessAdd.component.ts';
// import { GuideComponent } from '../guide';
import { Cookie, MissionService } from 'services';

@Component({
	selector: 'dashbroad',
	template: require('./dashbroad.html'),
	styles: [require('./dashbroad.scss')],
	directives: [ ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent, SearchBarComponent, PageFooterComponent, BusinessAddComponent,CrumbsComponent ],
	providers: [ HTTP_PROVIDERS ]
})

export class DashbroadComponent {
	constructor(private router: Router, private route: ActivatedRoute, private missionService: MissionService) {
		missionService.businessAddAnnounced$.subscribe(
			astronaut => {

		});
	}

	ngOnInit() {

	}


	onOpenBusinessAdd(){
		this.missionService.confirmBusinessAdd({selector: 'dashbroad'});
	}

}
