import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';


@Component({
    moduleId: module.id,
    selector: 'search-bar',
    template: require('./searchBar.html'),
    styles: [ require('./searchBar.scss') ],
    directives: [  ROUTER_DIRECTIVES ]
})

export class SearchBarComponent {
    searchKey: string = '';
    constructor( private router: Router ) {
        console.log('search bar ...');
        console.log(router);
    }
    ngOnInit() {

    }
    onSearch() {
        let skey = this.searchKey.trim();
        if (skey.length < 7 || skey.length > 11) {
            alert("请输入正确的车牌号或手机号");
            return;
        }

        console.log('searchKey: ', this.searchKey);
        this.router.navigate(['/dashbroad/search-list', { s: encodeURI(this.searchKey) }]);
    }
}
