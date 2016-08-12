import { Component,NgZone} from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';

@Component({
  selector: 'home',
  template: require('./home.html'),
  styles: [require('./home.scss')],
  directives: [ROUTER_DIRECTIVES],
  providers: [HTTP_PROVIDERS]
})

export class HomeComponent {
  current:number = 0;
  zone:any;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.zone = new NgZone({ enableLongStackTrace: false }); //事务控制器
  }
  // 初始化
  ngOnInit() {
    window.setInterval(() => {
      this.zone.run(()=>{
        if(this.current !== 1) {
            this.current = 1;
        } else {
            this.current = 0;
        }
      });
    }, 5000);
  }
}
