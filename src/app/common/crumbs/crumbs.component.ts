import { Component, OnDestroy, DoCheck } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';
import { routes } from '../../app.routes';
import { ThzsUtil } from 'services';
@Component({
    moduleId: module.id,
    selector: 'crumbs',
    template: require('./crumbs.html'),
    styles: [ require('./crumbs.scss') ],
    directives: [  ROUTER_DIRECTIVES ]
})

export class CrumbsComponent {
    routeConfig: any;
    crumbs: any;
    sub: any;
    customerInfoSub: any;
    confirmCrumbs: any;
    constructor( private router: Router, private route: ActivatedRoute, private thzsUtil: ThzsUtil ) {
        this.routeConfig = this.formatConfig(routes);
        console.log(this.routeConfig);
        
        this.sub = this.router.events.filter( event => event instanceof NavigationEnd )
                                    .map( event => {
                                        return event.url;
                                    } )
                                    .subscribe( (data: any) => {
                                        console.log('pp', this.thzsUtil.willChangePage);
                                        if (this.thzsUtil.willChangePage) {
                                            this.confirmCrumbs = this.thzsUtil.willChangePage.subscribe(value => {
                                                console.log('value', value);
                                                if (value) {
                                                    this.crumbsHandler(data);
                                                }
                                            });
                                        } else {
                                            this.crumbsHandler(data);
                                        }
                                        
                                    } );
        this.customerInfoSub = this.thzsUtil.customerInfo$.subscribe( info => {
            this.crumbs.forEach( item => {
                if (item.url.includes('/dashbroad/customer-detail') || item.url.includes('/dashbroad/customer-edit')) {
                    item.title = info.vehicleLicence;
                    this.thzsUtil.currentCustomerInfo = info;
                }
            });
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
        this.customerInfoSub.unsubscribe();
    }

    crumbsHandler(data) {
        let urls = [];
        let urlobj = {};
        let url = data;
        let param = {
            params: {},
            url: ''
        };
        if (!url) return;
        this.crumbs = [];
        url = url.split('/');
        url = url.pop();
        if (url === '') return;
        urls = this.routeConfig.filter( r => r.path != '' && url.includes(r.path));
        if (data.indexOf(';') > -1) {
            param.params = this.getParamObj(data);
            param.url = data.slice(0, data.indexOf(';'));
        }
        this.crumbs.push({
            url: data.indexOf(';') > -1 ? [param.url, param.params] : [data],
            title: urls[0] && urls[0].data ? urls[0].data.title : ''
        });
        if (url.includes('business-list')) {
            this.crumbs = [];
        }
        if (url.includes('customer-detail') || url.includes('customer-edit')) {
            this.crumbs[0].title = this.thzsUtil.currentCustomerInfo ? this.thzsUtil.currentCustomerInfo.vehicleLicence : this.crumbs[0].title;
        }
        
        if ( url.includes('add-store') || url.includes('modify-store') || url.includes('modify-pwd') ) {
            this.crumbs.unshift({
                url: '/dashbroad/my-account',
                title: '我的账户'
            });
        }
        if ( url.includes('employee-add') || url.includes('employee-edit') ) {
            this.crumbs.unshift({
                url: '/dashbroad/employee-list',
                title: '我的技师'
            });
        }
        if ( url.includes('customer-add') || url.includes('customer-edit') || url.includes('customer-detail') || url.includes('search-list') ) {
            this.crumbs.unshift({
                url: '/dashbroad/customer-list',
                title: '我的顾客'
            });
        }
        if (data.includes('report/week/satisfaction')) {
            this.crumbs = [{
                url: data,
                title: '满意度报告'
            }];
        }
    }

    // ngDoCheck() {
        
    //     let len = this.crumbs.length;
    //     let url = this.router.url;
    //     if (len > 0 && this.crumbs[len - 1] && this.crumbs[len - 1].title === '检索结果' && !url.includes('search-list')) {
    //         if (url.includes('customer-add')) {
    //             this.crumbs[len - 1].title = '添加顾客';
    //             return;
    //         }
    //         if (url.includes('customer-edit')) {
    //             this.crumbs[len - 1].title = this.thzsUtil.currentCustomerInfo.vehicleLicence;
    //             return;
    //         }
    //         if (url.includes('employee-add')) {
    //             this.crumbs[len - 1].title = '添加技师';
    //             this.crumbs[len - 2].title = '我的技师';
    //             return;
    //         }
    //         if (url.includes('employee-edit')) {
    //             this.crumbs[len - 1].title = '编辑技师';
    //             this.crumbs[len - 2].title = '我的技师';
    //             return;
    //         }
    //         if (url.includes('modify-store')) {
    //             this.crumbs[len - 1].title = '修改门店信息';
    //             this.crumbs[len - 2].title = '我的账户';
    //             return;
    //         }
    //         if (url.includes('add-store')) {
    //             this.crumbs[len - 1].title = '新增门店';
    //             this.crumbs[len - 2].title = '我的账户';
    //             return;
    //         }
    //         if (url.includes('modify-pwd')) {
    //             this.crumbs[len - 1].title = '修改密码';
    //             this.crumbs[len - 2].title = '我的账户';
    //             return;
    //         }

    //     }
    // }

    formatConfig(config = []) {
        let ret = [];
        const getRoute = function(cfgs) {
            for ( let cfg of cfgs ) {
                ret.push(cfg);
                if (cfg.children) {
                    getRoute(cfg.children);
                }
            }
        }
        getRoute(config);
        return ret;
    }
    getParamObj(s) {
        // let ret = '{';
        // let params = s.slice(s.indexOf(';') + 1);
        // params = params.split(';');
        
        // for ( let i = 0, len = params.length; i < len; i++ ) {
        //     let karr = params[i].split('=');
        //     if (karr.length > 1) {
        //         if (i > 0) {
        //             ret += ',';
        //         }
        //         ret += `${karr[0]}:'${karr[1]}'`;
        //     }
        // }
        // ret += '}';
        let ret = {};
        let params = s.slice(s.indexOf(';') + 1);
        params = params.split(';');
        for (let k of params) {
            let arr = k.split('=');
            if (arr.length > 1) {
                ret[arr[0]] = arr[1];
            }
        }
        return ret;
    }
    
}
