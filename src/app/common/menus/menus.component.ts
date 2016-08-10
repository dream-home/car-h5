import { Component} from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import { Cookie } from '../../services';

@Component({
  selector: 'menus',
  template: require('./menus.html'),
  styles: [require('./menus.scss')],
  directives: [ROUTER_DIRECTIVES],
  providers: [HTTP_PROVIDERS]
})

export class MenusComponent {
  constructor(private router: Router, private route: ActivatedRoute) {

  }

  onExit() {
    Cookie.remove('token');
    Cookie.remove('shopId');
    localStorage.removeItem("token");
    localStorage.removeItem("shopId");
    this.router.navigate(['/login-min']);
  }
}
