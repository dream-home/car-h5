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
import { Cookie,AuthService } from '../../services';

@Component({
	moduleId: module.id,
	selector: 'menus',
	template: require('./menus.html'),
	styles: [require('./menus.scss')],
	directives: [ROUTER_DIRECTIVES],
	providers: [HTTP_PROVIDERS, UserApi, CommonApi, Md5,AuthService ]
})

export class MenusComponent {
	constructor(private router: Router,private route: ActivatedRoute,private authService:AuthService) {

	}

	onExit(){
		this.authService.logout();
	}
}
