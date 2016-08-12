import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';

@Component({
    moduleId: module.id,
    selector: 'crumbs',
    template: require('./crumbs.html'),
    styles: [ require('./crumbs.scss') ],
    directives: [  ROUTER_DIRECTIVES ]
})

export class CrumbsComponent {
    routeConfig: any;
    crumbs: <string>[] = [];
    sub: nay;
    constructor( private router: Router, private route: ActivatedRoute ) {
        this.routeConfig = this.formatConfig(this.router.config);
        console.log('this.routeConfig', this.routeConfig);
        this.sub = this.router.events.filter( event => event instanceof NavigationEnd )
                                    .map( event => {
                                        console.log('crumb map() event', event);
                                        return event.url;
                                    } )
                                    .subscribe( (data: any) => {
                                        console.log('crumb map() data', data);
                                        let urls = [];
                                        let urlobj = {};
                                        let url = data;
                                        if (!url) return;
                                        this.crumbs = [];
                                        url = url.split('/');
                                        url = url.pop();
                                        if (url === '') return;
                                        urls = this.routeConfig.filter( r => url.includes(r.path));
                                        this.crumbs.push({
                                            url: data,
                                            title: urls[0] && urls[0].data ? urls[0].data.title : ''
                                        });
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
                                        if ( url.includes('customer-add') || url.includes('customer-edit') || url.includes('customer-detail') ) {
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
    }
    ngOnInit() {

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
    
}
