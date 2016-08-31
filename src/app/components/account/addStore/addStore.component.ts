import { Component, Input, Output, NgZone, ViewChild } from '@angular/core';
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
import { DialogService, ThzsUtil } from 'services';

@Component({
	moduleId: module.id,
	selector: 'add-store',
	template: require('./addStore.html'),
	styles: [require('./addStore.scss')],
	directives: [ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent, SearchBarComponent, PageFooterComponent, StoreFormComponent],
	providers: [ HTTP_PROVIDERS, DialogService ]
})

export class AddStoreComponent {
	@ViewChild(StoreFormComponent) sf: StoreFormComponent;
	isSuccess: boolean = false;
	constructor(private router: Router, private route: ActivatedRoute, private dialogService: DialogService, private thzsUtil: ThzsUtil) {

	}

	ngOnInit() {

	}
	onSuccess(data){
		this.isSuccess = true;
		this.router.navigate(['/dashbroad/my-account']);
	}
	canDeactivate(): Observable<boolean> | boolean {
		if ( this.isSuccess || this.sf.hasChange() ) {
			return true;
		}
		let p = this.dialogService.confirm('当前页面尚有信息未保存，是否离开？');
		let o = Observable.fromPromise(p);
		this.thzsUtil.willChangePage = o;
		return o;
	}
}
