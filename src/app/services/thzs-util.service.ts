import { Injectable }    from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class ThzsUtil {
    public shopChanged$: Observable<number>;
    public customerInfo$: Observable<any>;
    public currentShopInfo: any;
    public currentCustomerInfo: any;
    private shopChangedSource = new Subject<number>();
    private customerInfoSource = new Subject<any>();
    constructor () {
       this.shopChanged$ = this.shopChangedSource.asObservable();
       this.customerInfo$ = this.customerInfoSource.asObservable();
    }
    changeShop(id) {
        console.log('changeShop: ', id);
        this.shopChangedSource.next(id);
    }
    getCustomerInfo(info: any) {
        console.log('customer info', info);
        this.customerInfoSource.next(info);
    }
}
