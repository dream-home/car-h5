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
import { MissionService } from '../../services';

@Component({
	selector: 'guide',
	template: require('./guide.html'),
	styles: [require('./guide.scss')],
	directives: [ ROUTER_DIRECTIVES ],
	providers: [ HTTP_PROVIDERS ]
})

export class GuideComponent {
	next:number = 1;
	sub: any;
	locale: string;
	constructor(private router: Router, private route: ActivatedRoute,private missionService: MissionService) {
		missionService.missionConfirmed$.subscribe(
      astronaut => {
				if(astronaut=='menus'){
					this.init();
				}
				if(astronaut=='customer-detail'){
					this.next =	+window.localStorage.getItem('next');
				}
      });
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
      this.locale = this.router.url;
			if(!window.localStorage.getItem('olds')){
				this.init();
			}else{
				this.next = 0;
				localStorage.removeItem("next");
			}
    });
	}

	ngOnDestroy() {
    this.sub.unsubscribe();
  }

	init(){
		this.router.navigate(['/dashbroad/business-list']);
		this.onNext(0);
	}

	onAgain(){
		localStorage.removeItem("olds");
    localStorage.removeItem("next");
		this.init();
	}

	isCustomerDetail(){
		return this.router.url.indexOf('/dashbroad/customer-detail')!=-1;
	}

	onNext(index){
		this.next = index + 1;
		window.localStorage.setItem('next',String(this.next));
		if(index==2){
			this.onOpenBusinessAdd();
		}
		if(index==9){
			window.localStorage.setItem('olds','true');
		}
	}

	onOpenBusinessAdd(){
		this.missionService.confirmBusinessAdd({selector: 'guide'});
	}

}
