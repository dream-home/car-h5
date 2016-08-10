import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { Cookie } from 'services';
import { UserApi } from 'client';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
    constructor(private uApi: UserApi, private router: Router) {

    }
  isLoggedIn: boolean = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string = 'login-min';

    login(phone,pwd,rnd) {
      return this.uApi.userLoginPost(phone, Md5.hashStr(pwd, false).toString(), rnd)
        .subscribe((data) => {
          if (data.meta.code === 200) {
            this.isLoggedIn = true;
            Cookie.save('token', data.data.User.token, 7);
            Cookie.save('shopId', data.data.User.lastShopId);
            this.router.navigate([data.data.User.lastShopId === null?'/init-store':'/dashbroad/business-list']);
          } else {
            alert(data.error.message);
          }
        });
    }

  logout() {
      this.uApi.userLogoutPost().subscribe(data=>{
        if(data.meta.code==200){
          this.isLoggedIn = false;
          Cookie.remove('token');
          Cookie.remove('shopId');
          this.router.navigate([this.redirectUrl]);
        }
    })
  }
}
