import { WebpackAsyncRoute } from '@angularclass/webpack-toolkit';
import { RouterConfig } from '@angular/router';
import { NoContent } from 'common';

// components
import * as components from 'components';
import { AuthGuard,CanDeactivateGuard } from './services';

export const routes:RouterConfig = [

  { path: 'login-min', component: components.LoginMinComponent },
  { path: 'register', component: components.RegisterComponent },
  { path: 'forget-pwd', component: components.ForgetPwdComponent },
  { path: 'init-store', component: components.InitStoreComponent },
  { path: 'survey-pc', component: components.SurveyPcComponent },
  { path: 'survey-mobile', component: components.SurveyMobileComponent },
  { path: 'dashbroad',component: components.DashbroadComponent,
    children: [
      { path: 'my-account', component: components.MyAccountComponent },
      { path: 'modify-store', component: components.ModifyStoreComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'add-store', component: components.AddStoreComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'modify-pwd', component: components.ModifyPwdComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'employee-add', component: components.EmployeeAddComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'employee-edit', component: components.EmployeeEditComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'employee-list', component: components.EmployeeListComponent },
      { path: 'customer-add', component: components.CustomerAddComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'customer-edit', component: components.CustomerEditComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'customer-detail', component: components.CustomerDetailComponent },
      { path: 'customer-list', component: components.CustomerListComponent },
      { path: 'search-list', component: components.SearchListComponent },
      { path: 'report/week/business', component: components.ReportWeekBusinessComponent },
      { path: 'report/week/satisfaction', component: components.ReportWeekSatisfactionComponent },
      { path: 'business-add', component: components.BusinessAddComponent },
      { path: 'business-list', component: components.BusinessListComponent }
      //,canActivate: [AuthGuard],
    ]
  },
  { path: '**',    component: NoContent },
];

// Async load a component using Webpack's require with es6-promise-loader and webpack `require`
// asyncRoutes is needed for our @angularclass/webpack-toolkit that will allow us to resolve
// the component correctly

export const asyncRoutes: AsyncRoutes = {
  // we have to use the alternative syntax for es6-promise-loader to grab the routes
  // 'dashbroad': require('es6-promise-loader!./dashbroad'),
  // 'Detail': require('es6-promise-loader!./+detail'),
  // 'Index': require('es6-promise-loader!./+detail'), // must be exported with detail/index.ts
};


// Optimizations for initial loads
// An array of callbacks to be invoked after bootstrap to prefetch async routes
export const prefetchRouteCallbacks: Array<IdleCallbacks> = [
  // asyncRoutes['About'],
  // asyncRoutes['Detail'],
   // es6-promise-loader returns a function
];


// Es6PromiseLoader and AsyncRoutes interfaces are defined in custom-typings
