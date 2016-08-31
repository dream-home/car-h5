import { Component, Input, Output } from '@angular/core';
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
import { DialogService, ThzsUtil } from 'services';
@Component({
	moduleId: module.id,
	selector: 'modify-pwd',
	template: require('./modifyPwd.html'),
	styles: [require('./modifyPwd.scss')],
	directives: [ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent, SearchBarComponent, PageFooterComponent],
	providers: [HTTP_PROVIDERS, UserApi, CommonApi, Md5, DialogService ]
})

export class ModifyPwdComponent {
	pwd: any;
    submitedErrMsg: string = '';
    active: Boolean = true;
    isEqual: Boolean = true;
    opwdErr: boolean = false;
    pwdErr: boolean = false;
    rpwdErr: boolean = false;
    oldPassword: string = '';
    password: string = '';
    rePassword: string = '';
    hasSave: boolean = false;
	constructor(private router: Router,  private route: ActivatedRoute, private uApi: UserApi, private cApi: CommonApi, private dialogService: DialogService, private thzsUtil: ThzsUtil) {
	}

	ngOnInit() {
	}

    onSave() {
        if ( this.onCurrentPwdBlur() && this.onPwdBlur() && this.onRepasswordBlur() ) {
            let op = Md5.hashStr(this.oldPassword.trim(), false).toString();
            let np = Md5.hashStr(this.password.trim(), false).toString();
            let rnp = Md5.hashStr(this.rePassword.trim(), false).toString();
            console.log(op, np, rnp);
            this.uApi.userChangePwdPost(op, np, rnp).subscribe(data => {
                console.dir(data);
                if (data.meta.code === 200) {
                    if (data.data && data.data.User) {
                        alert('密码修改成功');
                        this.hasSave = true;
                        this.router.navigate(['/dashbroad/my-account']);
                    }
                } else {
                    // alert(data.error.message);
                    this.submitedErrMsg = data.error.message;
                }
                    
            });
        } else {
            return false;
        }

    }

    onCancel() {
        this.router.navigate(['/dashbroad/my-account']);
    }

    onRepasswordBlur () {
        let opd = this.rePassword.trim();
        this.rpwdErr = opd && (/^[\x21-\x7E]{6,20}$/.test(opd)) ?  false : true;
        if ( this.rpwdErr ) {
            return false;
        }
        this.isEqual = opd === this.password.trim() ? true : false;
        return this.isEqual;
    }

    onRepasswordFocus () {
        this.isEqual = true;
        this.rpwdErr = false;
    }
    onCurrentPwdFocus() {
        this.opwdErr = false;
        if (this.submitedErrMsg) {
            this.submitedErrMsg = '';
        }
    }
    onCurrentPwdBlur() {
        let opd = this.oldPassword.trim();
        this.opwdErr = opd && (/^[\x21-\x7E]{6,20}$/.test(opd)) ?  false : true;
        return !this.opwdErr;
    }
    onPwdFocus() {
        this.pwdErr = false;
        this.isEqual = true;
    }
    onPwdBlur() {
        let opd = this.password.trim();
        this.pwdErr = opd && (/^[\x21-\x7E]{6,20}$/.test(opd)) ?  false : true;
        return !this.pwdErr;
    }

    canDeactivate(): Observable<boolean> | boolean {
		if ( this.hasSave || (this.oldPassword.trim() === '' && this.password.trim() === '' && this.rePassword.trim() === '') ) {
			return true;
		}
		let p = this.dialogService.confirm('当前页面尚有信息未保存，是否离开？');
		let o = Observable.fromPromise(p);
        this.thzsUtil.willChangePage = o;
		return o;
	}

}
