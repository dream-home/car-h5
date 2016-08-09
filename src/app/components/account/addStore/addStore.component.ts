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
import { StoreFormComponent } from '../../storeForm/storeForm.component.ts';

@Component({
	moduleId: module.id,
	selector: 'add-store',
	template: require('./addStore.html'),
	styles: [require('./addStore.scss')],
	directives: [ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent, SearchBarComponent, PageFooterComponent, StoreFormComponent],
	providers: [ HTTP_PROVIDERS ]
})

export class AddStoreComponent {
	constructor(private router: Router, private route: ActivatedRoute) {

	}

	ngOnInit() {

	}
	onSuccess(data){
		this.router.navigate(['/dashbroad/my-account']);
	}

}
