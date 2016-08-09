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

@Component({
	moduleId: module.id,
	selector: 'modify-pwd',
	template: require('./modifyPwd.html'),
	styles: [require('./modifyPwd.scss')],
	directives: [ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent, SearchBarComponent, PageFooterComponent],
	providers: [HTTP_PROVIDERS, UserApi, CommonApi, Md5 ]
})

export class ModifyPwdComponent {
	pwd: any;
    submitedErrMsg: string = '';
    mpwdForm: ControlGroup;
    active: Boolean;
    isEqual: Boolean = true;
	constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private uApi: UserApi, private cApi: CommonApi) {
		this.mpwdForm = fb.group({
            'oldPassword': [''],
            'password': [''],
            'rePassword': ['']
        });
        this.active = true;


	}

	ngOnInit() {
		
	}

    onSave() {
        console.log(this.mpwdForm);
        if ( this.isEqual && this.mpwdForm.valid ) {
            let params = this.mpwdForm.value;
            console.log('params', params);
            let op = Md5.hashStr(params.oldPassword, false).toString();
            let np = Md5.hashStr(params.password, false).toString();
            let rnp = Md5.hashStr(params.rePassword, false).toString();
            console.log(op, np, rnp);
            this.uApi.userChangePwdPost(op, np, rnp).subscribe(data => {
                console.dir(data);
                if(data.meta.code === 200) {
                    if (data.data && data.data.User) {
                        alert('密码修改成功');
                    }
                } else {
                    // alert(data.error.message);
                    this.submitedErrMsg = data.error.message;
                }
                    
            });
        } else {
            alert('请输入正确的信息');
            console.log(this.mpwdForm);
            return false;
        }

    }
    onReset() {
        this.mpwdForm = this.fb.group({
            'oldPassword': [''],
            'password': [''],
            'rePassword': ['']
        });
        // this.mpwdForm.controls.rePassword.isEq = 1;
        console.log(this.mpwdForm);
        this.active = false;
        setTimeout(() => this.active = true, 0);
    }

    onCancel() {
        this.router.navigate(['/dashbroad/my-account']);
    }

    onRepasswordBlur () {
        let vals = this.mpwdForm.value;
        if ( vals.rePassword === '' ) {
            return;
        }
        if (vals.rePassword !== vals.password) {
            this.isEqual = false;
            return;
        } else {
            this.isEqual = true;
        }
    }

    onRepasswordFocus () {
        this.isEqual = true;
    }
    onCurrentPwdFocus() {
        if (this.submitedErrMsg) {
            this.submitedErrMsg = '';
        }
    }


}
