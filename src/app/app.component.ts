/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';

/*
 * App Component
 * Top Level Component
 */
 @Component({
   selector: 'app',
   template: `<router-outlet></router-outlet>`,
   styles: [require('assets/css/app.scss')],
   encapsulation: ViewEncapsulation.None
 })

export class App {

  constructor() {

  }

  ngOnInit() {
    moment.locale('zh-cn');
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
