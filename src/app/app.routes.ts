import { WebpackAsyncRoute } from '@angularclass/webpack-toolkit';
import { RouterConfig } from '@angular/router';
import { NoContent } from 'common';

// components
import * as components from 'components';
import { AuthGuard,CanDeactivateGuard } from './services';

export const routes:RouterConfig = [

  { path: '', component: components.HomeComponent, data: {title: '车门店'} },
  { path: 'login-min', component: components.LoginMinComponent, data: {title: '登录'} },
  { path: 'register', component: components.RegisterComponent, data: {title: '注册'} },
  { path: 'forget-pwd', component: components.ForgetPwdComponent, data: {title: '忘记密码'} },
  { path: 'init-store', component: components.InitStoreComponent,canActivate: [AuthGuard], data: {title: '添加门店'}},
  { path: 'survey-pc', component: components.SurveyPcComponent, data: {title: '调查问卷'} },
  { path: 'survey-mobile', component: components.SurveyMobileComponent, data: {title: '调查问卷'} },

  { path: 'dashbroad',component: components.DashbroadComponent,
    data: {
      title: '仪表盘'
    },
    children: [
      {
        path: 'my-account',
        component: components.MyAccountComponent,
        canActivate: [AuthGuard],
        data: {title: '我的账户'}
      },
      { path: 'modify-store', component: components.ModifyStoreComponent, canDeactivate: [CanDeactivateGuard],canActivate: [AuthGuard], data: {title: '修改门店信息'} },
      { path: 'add-store', component: components.AddStoreComponent, canDeactivate: [CanDeactivateGuard],canActivate: [AuthGuard], data: {title: '新增门店'} },
      { path: 'modify-pwd', component: components.ModifyPwdComponent, canDeactivate: [CanDeactivateGuard],canActivate: [AuthGuard], data: {title: '修改密码'} },
      { path: 'employee-add', component: components.EmployeeAddComponent, canDeactivate: [CanDeactivateGuard],canActivate: [AuthGuard], data: {title: '添加技师'} },
      { path: 'employee-edit', component: components.EmployeeEditComponent, canDeactivate: [CanDeactivateGuard],canActivate: [AuthGuard], data: {title: '编辑技师'} },
      { path: 'employee-list', component: components.EmployeeListComponent,canActivate: [AuthGuard], data: {title: '我的技师'} },
      { path: 'customer-add', component: components.CustomerAddComponent, canDeactivate: [CanDeactivateGuard],canActivate: [AuthGuard], data: {title: '添加顾客'} },
      { path: 'customer-edit', component: components.CustomerEditComponent, canDeactivate: [CanDeactivateGuard],canActivate: [AuthGuard], data: {title: '编辑顾客'} },
      { path: 'customer-detail', component: components.CustomerDetailComponent,canActivate: [AuthGuard], data: {title: '顾客详情'} },
      { path: 'customer-list', component: components.CustomerListComponent,canActivate: [AuthGuard], data: {title: '我的顾客'} },
      { path: 'search-list', component: components.SearchListComponent,canActivate: [AuthGuard], data: {title: '检索结果'} },
      // { path: 'report/week/business', component: components.ReportWeekBusinessComponent,canActivate: [AuthGuard], data: {title: '满意度报告'} },
      { path: 'report/week/satisfaction', component: components.ReportWeekSatisfactionComponent,canActivate: [AuthGuard], data: {title: '满意度评价报告'} },
      { path: 'business-add', component: components.BusinessAddComponent,canActivate: [AuthGuard], data: {title: '添加服务'} },
      { path: 'business-list', component: components.BusinessListComponent,canActivate: [AuthGuard], data: {title: '服务列表'} }
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
