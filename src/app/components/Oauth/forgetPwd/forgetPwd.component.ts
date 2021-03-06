import { Component, Input, Output, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {  ControlGroup, FormBuilder } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { UserApi, CommonApi } from 'client';
import { MainLogoComponent, PageFooterComponent } from 'common';

@Component({
  moduleId: module.id,
  selector: 'forget-pwd',
  template: require('./forgetPwd.html'),
  styles: [require('./forgetPwd.scss')],
  directives: [ROUTER_DIRECTIVES, MainLogoComponent, PageFooterComponent],
  providers: [HTTP_PROVIDERS, UserApi, CommonApi, Md5],
})

export class ForgetPwdComponent {
  zone: any;
  seekDisabeld: number = 0;
  seekTime: number = 0;
  seekBtnTitle: any = '发送验证码';
  next: number = 1;
  loading: number = 0;
  sign: string;
  img: any;
  diff: number = 0;
  timeout: any;
  errorMsg: string;
  openProtocol: boolean = false;
  fp: any = {};
  isCode: boolean = true;

  constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private uApi: UserApi, private cApi: CommonApi) {
    this.zone = new NgZone({ enableLongStackTrace: true }); // 事务控制器
  }
  // 初始化
  ngOnInit() {
    this.getCodeImg();
    // this.initForm();
  }

  onInitError() {
    this.errorMsg = null;
  }

  /**
   * 获取图片验证码
   * @return {[type]} [description]
   */
  getCodeImg() {
    this.cApi.commonCaptchaBase64Post().subscribe((data: Response) => {
      this.img = 'data:image/jpeg;base64,' + data.text();
      this.uApi.defaultHeaders.set('uuid', data.headers.get('uuid'));
      this.isCode = true;
    });
  }
  onChangeCodeImg() {
    this.getCodeImg();
  }

  blur(data, e) {
    data.blur = e.type == 'blur';
  }

  /**
   * 点击发送验证码
   * @param  {[type]} phone 手机号码
   * @param  {[type]} rnd   图片验证码
   * @return {[type]}       [description]
   */
  onSeekPhone(phone, rnd) {
    if (this.seekDisabeld) {
      return;
    }
    if (!phone) {
      return;
    }
    if (!rnd) {
      return;
    }
    this.errorMsg = null;
    this.seekDisabeld = 1;
    this.seekTime = 60;
    this.getPhoneCode(phone, rnd).subscribe(data => {
      if (data.meta.code !== 200) {
        this.errorWin(data.error.message);
        this.seekBtnTitle = '重新发送';
        this.seekDisabeld = 0;
      } else {
        // this.seekBtnTitle = '发送验证码';
        //倒计时
        this.timeout = window.setInterval(() => {
          this.zone.run(() => {
            if (this.seekTime > 0) {
              this.seekBtnTitle = this.seekTime + 's';
              this.seekTime--;
            } else {
              this.seekBtnTitle = '重新发送';
              this.seekDisabeld = 0;
              clearInterval(this.timeout);
            }
          });
        }, 1000);
      }
    });
  }
  /**
   * 请求手机验证码
   * @param  {[type]} phone 手机号码
   * @param  {[type]} rnd   图片验证码
   * @return {[type]}       状态
   */
  getPhoneCode(phone: string = '', rnd: string = '') {
    let salt = 'thzs0708';
    this.sign = Md5.hashStr(phone + rnd + salt, false).toString();
    return this.uApi.userPasswordSmsPost(phone, rnd, this.sign);
  }
  //验证手机号
  onCheckPhone() {
    this.errorMsg = null;
    this.loading = 1;
    let params = this.fp;
    params.uuid = this.uApi.defaultHeaders.get('uuid');
    // code: string, phone: string, uuid: string,
    this.cApi.commonCodeVerifyGet(params.code, params.phone, params.uuid).subscribe(data => {
      if (data.meta.code === 200) {
        this.next = 2;
        this.sign = data.data.sign;
      } else {
        this.errorWin(data.error.message);
      }
      this.loading = 0;
    });
  }

  errorWin(message) {
    if (message === '短信验证码不存在' || message === '您离开的时间太长，请重新操作' || message === '您今天的短信发送已达到3次上限' || message === '短信验证码超时，导致userId不存在') {
      if (this.next == 2) {
        this.openProtocol = true;
      }
      if (message === '短信验证码不存在') {
        this.errorMsg = '验证码已失效,请更换';
      } else {
        this.errorMsg = message;
      }
    } else {
      this.errorMsg = message;
    }
    this.getCodeImg();
  }

  chkRnd(rnd) {
    if (rnd && rnd.length > 3) {
      let uuid = this.uApi.defaultHeaders.get('uuid');
      this.cApi.commonCaptchaValidateGet(uuid, rnd).subscribe(data => {
        this.isCode = data.meta.code == 200 ? false : true;
        if (data.meta.code !== 200) {
          this.errorMsg = data.error.message === '短信验证码超时，导致userId不存在'?'您离开的时间太长，请重新操作':data.error.message;
        }
      });
    }
  }

  // 重置密码
  onEditPwd() {
    this.loading = 1;
    let params = this.fp;
    if (params.pwd !== params.checkPwd) {
      this.diff = 1;
      this.loading = 0;
      return false;
    } else {
      this.diff = 0;
    }
    // password: string, rePassword: string, sign: string
    this.uApi.userUpdatePwdPost(Md5.hashStr(params.pwd, false).toString(), Md5.hashStr(params.checkPwd, false).toString(), this.sign)
      .subscribe(data => {
        this.loading = 0;
        if (data.meta.code === 200) {
          alert('密码修改成功');
          this.router.navigate(['/login-min']);
        } else {
          this.errorWin(data.error.message);
        }
      });
  }

  onClose(key) {
    if (key === 'okey') {

      if (this.errorMsg === '短信验证码超时，导致userId不存在') {
        // this.router.navigate(['/login-min']);
        this.next = 1;
        this.getCodeImg();
      }

    }
    this.openProtocol = false;

  }

  toHome() {
    this.router.navigate(['']);
  }
  goBack() {
    window.history.back();
  }
}
