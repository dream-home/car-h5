import { Component, Input, Output, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { HTTP_PROVIDERS, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {  ControlGroup, FormBuilder } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { UserApi, CommonApi, ShopApi, User } from 'client';
import { MainLogoComponent, PageFooterComponent } from 'common';
import { Cookie } from 'services';

@Component({
  selector: 'register',
  template: require('./register.html'),
  styles: [require('./register.scss')],
  directives: [ROUTER_DIRECTIVES, MainLogoComponent, PageFooterComponent],
  providers: [HTTP_PROVIDERS, UserApi, CommonApi, ShopApi, Md5]
})

export class RegisterComponent {
  rForm: ControlGroup;
  zone: any;
  user: any = {};
  seekDisabeld: number = 0;
  seekTime: number = 0;
  seekBtnTitle: any = '发送验证码';
  openProtocol: number = 0;
  img: any;
  timeout: any;
  sign: string;
  errorPhoneCode: string;
  errorMsg: string;
  loading: number = 0;
  openErrorProtocol: boolean = false;
  oldPhone: number;
  isCode: boolean = true;

  constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private uApi: UserApi, private cApi: CommonApi, private sApi: ShopApi) {
    this.zone = new NgZone({ enableLongStackTrace: false }); //事务控制器
    //表单验证
    this.rForm = fb.group({
      'phone': [''],
      'rnd': [''],
      'code': [''],
      'pwd': [''],
    });
  }


  blur(data, e) {
    data.blur = e.type == 'blur';
  }

  //初始化
  ngOnInit() {
    this.getCodeImg();
  }

  ngOnDestroy() {
    window.clearInterval(this.timeout);
  }

  onInitError(){
    this.errorPhoneCode = null;
    this.errorMsg = null;
  }

  /**
   * 获取图片验证码
   * @return {[type]} [description]
   */
  getCodeImg() {
    this.cApi.commonCaptchaBase64Post().subscribe((data: Response) => {
      this.img = 'data:image/jpeg;base64,' + (data.text() || '');
      this.uApi.defaultHeaders.set('uuid', data.headers.get('uuid'));
      this.isCode = true;
    });
  }
  onChangeCode() {
    this.getCodeImg();
  }

  onOpenProtocol() {
    this.openProtocol = 1;
  }

  onClose() {
    this.openProtocol = 0;
  }

  onChkPhone(e) {
    if (e.target.value === this.oldPhone) {

    } else {
      this.errorPhoneCode = '';
      this.oldPhone = e.target.value;
    }
  }

  errorWin(message) {
    if (message === '短信验证码不存在' || message === '短信验证码超时，导致userId不存在' || message === '您今天的短信发送已达到3次上限') {
      // this.openErrorProtocol = true;
      if (message === '短信验证码不存在') {
        this.errorPhoneCode = '验证码已失效,请更换';
      } else {
        this.errorPhoneCode = message;
      }
      this.errorMsg = message;
    } else {
      this.errorPhoneCode = message;
      this.errorMsg = message;
    }
    this.getCodeImg();
  }

  onErrorClose() {
    this.openErrorProtocol = false;
  }

  chkRnd(e) {
    let rnd = e.target.value;
    let uuid = this.uApi.defaultHeaders.get('uuid');
    this.cApi.commonCaptchaValidateGet(uuid, rnd).subscribe(data => {
      this.zone.run(()=>{
        this.isCode = data.meta.code == 200 ? false : true;
      });
    });
  }

  /**
   * 点击发送验证码
   * @param  {[type]} phone 手机号码
   * @param  {[type]} rnd   图片验证码
   * @return {[type]}       [description]
   */
  onSeekPhone(phone, rnd) {
    this.errorMsg = null;
    if (this.seekDisabeld) {
      return;
    }
    if (!phone) {
      return;
    }
    if (!rnd) {
      return;
    }
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
            if (this.seekTime > 1) {
              this.seekTime--;
              this.seekBtnTitle = this.seekTime + 's';
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
    this.sign = Md5.hashStr(phone + rnd + salt).toString();
    return this.uApi.userRegisterSmsPost(phone, rnd, this.sign);
  }

  //注册
  onRegister() {
    this.errorMsg = null;
    this.loading = 1;
    let params = this.user;
    //mobile: string, password: string, code: string, captcha: string
    this.uApi.userRegisterPost(params.phone, Md5.hashStr(params.pwd, false).toString(), params.code, params.rnd)
      .subscribe((data) => {
        this.loading = 0;
        if (data.meta.code == 200) {
          Cookie.save('token', data.data.token, 14);
          Cookie.save('clientType', 'pc', 14);
          this.sApi.shopMyshopGet(data.data.token).subscribe(data => {
            if (data.meta.code === 200) {
              if (data.data.length > 0) {
                this.router.navigate(['/dashbroad/business-list']);
              } else {
                this.router.navigate(['/init-store']);
              }
            } else {
              this.errorWin(data.error.message);
            }
          });
        } else {
          this.errorWin(data.error.message);
        }
      })
  }

  toHome() {
    this.router.navigate(['']);
  }
  goBack() {
    window.history.back();
  }
}
