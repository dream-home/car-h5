import { Component, Input, Output, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {  ControlGroup, FormBuilder, Control } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { UserApi, CommonApi, ShopApi, UserResponse,LoginReq } from 'client';
import { MainLogoComponent, PageFooterComponent } from 'common';
import { Cookie,AuthService } from '../../../services';

@Component({
  selector: 'login-min',
  template: require('./loginMin.html'),
  styles: [require('./loginMin.scss')],
  directives: [ROUTER_DIRECTIVES,  MainLogoComponent, PageFooterComponent],
  providers: [HTTP_PROVIDERS, UserApi, CommonApi, ShopApi, Md5, Cookie,AuthService]
})

export class LoginMinComponent {
  loginForm: ControlGroup;
  zone: any;
  user: LoginReq = {phone:'',rnd:'',pwd:''};
  seekDisabeld: number = 0;
  seekBtnTitle: number = 0;
  img: any;
  loading: number = 0;
  constructor(private router: Router, private route: ActivatedRoute, private uApi: UserApi, private cApi: CommonApi, private sApi: ShopApi, private authService: AuthService) {
    this.zone = new NgZone({ enableLongStackTrace: false }); // 事务控制器
  }
  info(data){
    console.log(data);
  }
  // 初始化
  ngOnInit() {
    this.getCodeImg();
  }
  /**
   * 获取图片验证码
   * @return {[type]} [description]
   */
  getCodeImg() {
    this.cApi.commonCaptchaBase64Post().subscribe((data: Response) => {
      this.img = 'data:image/jpeg;base64,' + (data.text() || '');
      this.uApi.defaultHeaders.set('uuid', data.headers.get('uuid'));
    });
  }
  onChangeCodeImg() {
    this.getCodeImg();
  }
  // 登录
  onLogin() {
    // this.loading = 1;
    let params = this.user;
    // mobile: string, password: string, code: string,
    // this.authService.login(params.phone, params.pwd, params.rnd);
    this.uApi.userLoginPost(params.phone, Md5.hashStr(params.pwd, false).toString(), params.rnd)
      .subscribe((data) => {
        this.loading = 0;
        if (data.meta.code === 200) {
          Cookie.save('token', data.data.User.token, 7);
          Cookie.save('shopId', data.data.User.lastShopId);
          this.sApi.defaultHeaders.set('token', data.data.User.token);
          if (data.data.User.lastShopId === null) {
            this.router.navigate(['/init-store']);
          } else {
            this.sApi.defaultHeaders.set('shopId', data.data.User.lastShopId);
            this.router.navigate(['/dashbroad/business-list']);
          }
        } else {
          this.getCodeImg();
          alert(data.error.message);
        }
      });
  }

  toHome() {
    this.router.navigate(['']);
  }
  goBack() {
    window.history.back();
  }
}
