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
  { path: 'init-store', component: components.InitStoreComponent,canActivate: [AuthGuard]},
  { path: 'survey-pc', component: components.SurveyPcComponent },
  { path: 'survey-mobile', component: components.SurveyMobileComponent },
  { path: 'dashbroad',component: components.DashbroadComponent,
    children: [
      { path: 'my-account', component: components.MyAccountComponent,canActivate: [AuthGuard] },
      { path: 'modify-store', component: components.ModifyStoreComponent, canDeactivate: [CanDeactivateGuard],canActivate: [AuthGuard] },
      { path: 'add-store', component: components.AddStoreComponent, canDeactivate: [CanDeactivateGuard],canActivate: [AuthGuard] },
      { path: 'modify-pwd', component: components.ModifyPwdComponent, canDeactivate: [CanDeactivateGuard],canActivate: [AuthGuard] },
      { path: 'employee-add', component: components.EmployeeAddComponent, canDeactivate: [CanDeactivateGuard],canActivate: [AuthGuard] },
      { path: 'employee-edit', component: components.EmployeeEditComponent, canDeactivate: [CanDeactivateGuard],canActivate: [AuthGuard] },
      { path: 'employee-list', component: components.EmployeeListComponent,canActivate: [AuthGuard] },
      { path: 'customer-add', component: components.CustomerAddComponent, canDeactivate: [CanDeactivateGuard],canActivate: [AuthGuard] },
      { path: 'customer-edit', component: components.CustomerEditComponent, canDeactivate: [CanDeactivateGuard],canActivate: [AuthGuard] },
      { path: 'customer-detail', component: components.CustomerDetailComponent,canActivate: [AuthGuard] },
      { path: 'customer-list', component: components.CustomerListComponent,canActivate: [AuthGuard] },
      { path: 'search-list', component: components.SearchListComponent,canActivate: [AuthGuard] },
      { path: 'report/week/business', component: components.ReportWeekBusinessComponent,canActivate: [AuthGuard] },
      { path: 'report/week/satisfaction', component: components.ReportWeekSatisfactionComponent,canActivate: [AuthGuard] },
      { path: 'business-add', component: components.BusinessAddComponent,canActivate: [AuthGuard] },
      { path: 'business-list', component: components.BusinessListComponent,canActivate: [AuthGuard] }
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
