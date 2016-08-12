import { Injectable }    from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class ThzsUtil {
    public shopChanged$: Observable<number>;
    private shopChangedSource = new Subject<number>();
    private scs: Subscription;
    constructor () {
       this.shopChanged$ = this.shopChangedSource.asObservable();
        this.scs = this.shopChanged$.subscribe( item => {
            console.log('thzsutil: ', item);
        });
        console.log('scs', this.scs);
    }
   
  changeShop(id) {
      console.log('changeShop: ', id);
      this.shopChangedSource.next(id);
      
  }
}
