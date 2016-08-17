import { Component, OnDestroy } from '@angular/core';
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
    constructor( private router: Router, private route: ActivatedRoute, private thzsUtil: ThzsUtil ) {
        this.routeConfig = this.formatConfig(routes);
        this.sub = this.router.events.filter( event => event instanceof NavigationEnd )
                                    .map( event => {
                                        return event.url;
                                    } )
                                    .subscribe( (data: any) => {
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
                                        
                                        if ( url.includes('add-store') || url.includes('modify-store') || url.includes('modify-pwd') ) {
                                            this.crumbs.unshift({
                                                url: '/dashbroad/my-account',
                                                title: '我的账户'
                                            });
                                        }
                                        if ( url.includes('employee-add') || url.includes('employee-edit') ) {
                                            this.crumbs.unshift({
                                                url: '/dashbroad/employee-list',
                                                title: '我的员工'
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
                                    } );
        this.customerInfoSub = this.thzsUtil.customerInfo$.subscribe( info => {
            this.crumbs.forEach( item => {
                if (item.url.includes('/dashbroad/customer-detail') || item.url.includes('/dashbroad/customer-edit')) {
                    item.title = info.vehicleLicence;
                }
            });
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
        this.customerInfoSub.unsubscribe();
    }
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
