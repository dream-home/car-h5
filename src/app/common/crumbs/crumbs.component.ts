import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';
import { routes } from '../../app.routes';

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
    constructor( private router: Router, private route: ActivatedRoute ) {
        this.routeConfig = this.formatConfig(routes);
        this.sub = this.router.events.filter( event => event instanceof NavigationEnd )
                                    .map( event => {
                                        return event.url;
                                    } )
                                    .subscribe( (data: any) => {
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
