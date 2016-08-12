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
import { MissionService } from '../../services';
import { BusinessAddComponent } from '../business/businessAdd/businessAdd.component.ts';
import { GuideComponent } from '../guide';

@Component({
	selector: 'dashbroad',
	template: require('./dashbroad.html'),
	styles: [require('./dashbroad.scss')],
	directives: [ ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent, SearchBarComponent, PageFooterComponent, BusinessAddComponent,GuideComponent, CrumbsComponent ],
	providers: [ HTTP_PROVIDERS ]
})

export class DashbroadComponent {
	constructor(private router: Router, private route: ActivatedRoute, private missionService: MissionService) {
		missionService.businessAddAnnounced$.subscribe(
			astronaut => {

		});
		console.log('route: ', route);
		
		route.data.subscribe(data => {
			console.log('data: ', data);
		});
		console.log('router: ', router);
		router.routerEvents.subscribe(val => {
			console.log('val', val);
		});
		
		this.router.events.filter(event => {
			console.log('filter: event', event);
			return event instanceof NavigationEnd;
		}).map(_ => this.router.routerState)
		.map(state => {
			let route = this.activatedRoute;
			while (state.firstChild(route)) {
				
				route = state.firstChild(route);
				console.log('map route', route);
			}
			
			return route;
		})
		//.filter(route => route.outlet === PRIMARY_OUTLET)
		// .flatMap(route => route.data)
		.subscribe( (data: any) => {
			console.log(data);
		} )
	}

	ngOnInit() {

	}


	onOpenBusinessAdd(){
		this.missionService.confirmBusinessAdd({selector: 'dashbroad'});
	}

}
