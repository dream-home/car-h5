import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';

import { MainLogoComponent, PageFooterComponent } from 'common';
import { StoreFormComponent } from '../../storeForm/storeForm.component.ts';

@Component({
  moduleId: module.id,
  selector: 'init-store',
  template: require('./initStore.html'),
  styles: [require('./initStore.scss')],
  directives: [ROUTER_DIRECTIVES,  MainLogoComponent, PageFooterComponent,StoreFormComponent]
})

export class InitStoreComponent {

  constructor(private router: Router) {

  }
  // 初始化
  ngOnInit() {

  }

  onSuccess(data){
    this.router.navigate(['/dashbroad/business-list']);
  }

  toHome() {
    this.router.navigate(['']);
  }
  goBack() {
    window.history.back();
  }
}
