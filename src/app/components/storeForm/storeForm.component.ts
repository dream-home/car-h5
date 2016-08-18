import { Component, Input, Output, NgZone, EventEmitter } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import {  ControlGroup, FormBuilder, Control, NgControlGroup } from '@angular/common';
import { MdCheckbox } from '@angular2-material/checkbox/checkbox';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Md5 } from 'ts-md5/dist/md5';
import * as _ from 'lodash';

import { CommonApi, ShopApi, RegionApi, RegionItem, Shop,MyAcountResponse,UserApi } from 'client';
import { MissionService, ThzsUtil } from 'services';

const YEARS_16 = [2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000];
const STATION_30 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const SERVICE_LIST = [{ "id": 1, "name": "快修快保" }, { "id": 2, "name": "美容改装" }, { "id": 3, "name": "轮胎专项" }, { "id": 4, "name": "综合维修" }, { "id": 5, "name": "其他" }];
const SHOP_VALIDATE = {
  name: false,
  provinceId: false,
  cityId: false,
  address: false,
  serverType: false,
  area: true
};

@Component({
  selector: 'store-form',
  template: require('./storeForm.html'),
  styles: [require('./storeForm.scss')],
  directives: [ROUTER_DIRECTIVES, MdCheckbox],
  providers: [HTTP_PROVIDERS, CommonApi, ShopApi, RegionApi, Md5,UserApi]
})

export class StoreFormComponent {
  provinceList: Array<RegionItem>;
  cityList: Array<RegionItem>;
  // countyList: Array<RegionItem>;
  sList: any;
  STATION_30: any;
  YEARS_16: any;
  SERVICE_LIST: any;
  loading: number = 0;
  errorServiceType: number = 0;
  sub: any;
  id: number;
  shopList: any;
  oldShopList: string = '';
  showDelWin:boolean = false;
  user: any = {
    code: '',
    codeNull: '',
    codeErr: ''
  };
  defaultPhone:string;

  seekDisabeld: number = 0;
  seekTime: number = 0;
  seekBtnTitle: any = '发送验证码';
  openProtocol: number = 0;
  img: any;
  timeout: any;
  sign: string;
  errorPhoneCode: string;
  errorMsg: string;
  zone: any;
  showDetail:boolean = true;
  isCurrentStore: boolean = false;
  serverTypeErr = [];
  formValid: boolean = false;
  // @Input('store') shopList:Array<Shop>;
  @Output() success = new EventEmitter();

  constructor(private router: Router, private route: ActivatedRoute, private cApi: CommonApi, private sApi: ShopApi, private rApi: RegionApi, private uApi: UserApi, private missionService: MissionService, private thzsUtil: ThzsUtil) {
    this.shopList = [{index: 1, sList: _.cloneDeep(SERVICE_LIST), valid: _.cloneDeep(SHOP_VALIDATE), showTip: _.cloneDeep(SHOP_VALIDATE) }];
    this.zone = new NgZone({ enableLongStackTrace: false }); //事务控制器
    console.log('store form ', this.thzsUtil);
  }

  info(f){
    console.log(f);
  }

  

  // 初始化
  ngOnInit() {
    this.oldShopList = Md5.hashStr(JSON.stringify(this.shopList), false).toString();
    this.sub = this.route.params.subscribe((params) => {
      if (params['id']) {
        this.id = +params['id'];
        
        
        this.getStoreList();
        this.getMe();
      }
    });
    // this.getServiceType();
    this.getProvince();
    this.STATION_30 = STATION_30;
    this.YEARS_16 = YEARS_16;
    this.SERVICE_LIST = SERVICE_LIST;
    //this.getMe();
    this.getCodeImg();
  }

  getMe() {
    this.uApi.userMeGet().subscribe((data: MyAcountResponse) => {
      if ( data.meta.code === 200) {
          this.defaultPhone = data.data.user.mobile;
          this.isCurrentStore = this.id === data.data.user.lastShopId ? true : false;
          console.log('dd', data.data.user.lastShopId)
          console.log(this.id)

      }
      
    })
  }

  onToggleDetail(){
    this.showDetail = !this.showDetail;
  }

  // getMe() {
  //   this.uApi.userMeGet().subscribe((data: MyAcountResponse) => {
      
  //   })
  // }

  ngOnDestroy() {
    window.clearInterval(this.timeout);
  }

  /**
   * 获取图片验证码
   * @return {[type]} [description]
   */
  getCodeImg() {
    this.cApi.commonCaptchaBase64Post().subscribe((data: Response) => {
      this.img = 'data:image/jpeg;base64,' + (data.text() || '');
      this.uApi.defaultHeaders.set('uuid', data.headers.get('uuid'));
    });
  }
  onChangeCode() {
    this.getCodeImg();
  }

  /**
   * 点击发送验证码
   * @param  {[type]} phone 手机号码
   * @param  {[type]} rnd   图片验证码
   * @return {[type]}       [description]
   */
  onSeekPhone() {
    const phone = this.defaultPhone;
    const rnd = Math.floor(Math.random() * 9000 + 1000);
    if (this.seekDisabeld) {
      return;
    }
    if (!phone) {
      return;
    }
    if (!rnd) {
      return;
    }
    this.seekDisabeld = 1;
    this.seekBtnTitle = '发送中...';
    this.seekTime = 60;
    this.getPhoneCode(phone, String(rnd)).subscribe(data => {
      if (data.meta.code !== 200) {
        this.errorPhoneCode = data.error.message;
        this.seekBtnTitle = '重新发送';
        this.seekDisabeld = 0;
      } else {
        
        //倒计时
        this.timeout = window.setInterval(() => {
          this.zone.run(() => {
            if (this.seekTime > 1) {
              this.seekTime--;
              this.seekBtnTitle = this.seekTime + 's';
            } else {
              this.seekBtnTitle = '重新发送';
              this.seekDisabeld = 0;
              clearInterval(this.timeout);
            }
          });
        }, 1000);
      }
    });
  }
  /**
   * 请求手机验证码
   * @param  {[type]} phone 手机号码
   * @param  {[type]} rnd   图片验证码
   * @return {[type]}       状态
   */
  getPhoneCode(phone: string = '', rnd: string = '') {
    let salt = 'thzs0708';
    this.sign = Md5.hashStr(phone + rnd + salt).toString();
    return this.sApi.shopDeleteSmsPost(phone, rnd, this.sign);
  }

  getStoreList() {
    this.sApi.shopMyshopGet().subscribe(data => {
      this.loading = 0;
      if (data.meta.code === 200) {
        let dd: any = _.cloneDeep(data.data);
        this.shopList = dd.filter(data => {
          return this.id == data.id;
        }).map((data) => {
          data.sList = _.cloneDeep(SERVICE_LIST);
          data.openingDate = data.openingDate ? data.openingDate : 'undefined';
          data.station = data.station ? data.station : 'undefined';
          data.valid = _.cloneDeep(SHOP_VALIDATE);
          data.showTip = _.cloneDeep(SHOP_VALIDATE);
          data.sList.map((sub) => {
            sub.checked = data.serviceIds.indexOf(sub.id) != -1;
          })
          this.getCity(data.provinceId, data);
          for (let key in data.valid) {
            data.valid[key] = true;
          }
          console.log('data: ', data);
          
          return data;
        });
        this.formValid = this.formRequiredValid();
        console.log(this.formValid)
        console.log(!this.formValid, this.loading)
        console.log("old:", this.shopList)

      } else {
        alert(data.error.message);
      }
    });
  }

  hasChange() {
    let current = Md5.hashStr(JSON.stringify(this.shopList), false).toString();
    return current === this.oldShopList;
  }


  // 获取省列表
  getProvince() {
    this.rApi.regionProvinceGet().subscribe(data => {
      if (data.meta.code === 200) {
        this.provinceList = data.data;
      }
    })
  }

  // 获取市列表
  getCity(provinceId: number, item) {
    this.rApi.regionProvinceIdCityGet(provinceId + '').subscribe(data => {
      if (data.meta.code === 200) {
        item.cityList = data.data;
        if (this.id) {
          this.oldShopList = Md5.hashStr(JSON.stringify(this.shopList), false).toString();
        }

      }
    })
  }

  // 获取区域列表
  // getCounty(cityId: string) {
  //   this.rApi.regionCityIdCountyGet(cityId).subscribe((data) => {
  //     if (data.meta.code === 200) {
  //       this.countyList = data.data;
  //     }
  //   })
  // }

  // getServiceType() {
  //   this.cApi.commonDictServicesGet().subscribe(data => {
  //     if (data.meta.code === 200) {
  //       this.sList = data.data;
  //       this.shopList = [{ sList: _.cloneDeep(this.sList) }];
  //     }
  //   })
  // }

  trackByShops(index: number, shop: Shop) {
    return shop.index;
  }

  onAddShop(index,shop) {
    this.shopList.splice(index+1, 0, { index:shop.index+1,sList: _.cloneDeep(SERVICE_LIST), valid: _.cloneDeep(SHOP_VALIDATE), showTip: _.cloneDeep(SHOP_VALIDATE)});
    this.formValid = this.formRequiredValid();
    console.log('shoplist', this.shopList);
    // this.shopList.push({index:shop.index+1, name: '', provinceId: undefined, cityId: undefined, address: '', ownerName: '', phone: '', openingDate: '', area: null, station: undefined, sList: _.cloneDeep(SERVICE_LIST) });
  }

  onDelhop(index) {
    this.shopList.splice(index, 1);
  }

  onOpenDelWin(){

    this.showDelWin = true;
  }

  onExit() {
    window.history.back();
  }

  onDel() {
      this.sApi.shopDeleteDelete(String(this.id), this.user.code).subscribe(data => {
        if (data.meta.code === 200) {
         
          this.onCancelDelStore();
          // 刷新导航中的门店列表
          this.thzsUtil.refreshShopList(true);
          this.router.navigate(['/dashbroad/my-account']);
        } else {
          if (this.showDelWin) {
            this.user.codeErr = data.error.message;
          }
          
        }
      });
  }

  onDelStore() {
    if (!this.onDelCodeBlur()) return;
    this.onDel();

  }
  onCancelDelStore() {
    this.user.code = '';
    this.user.codeNull = '';
    this.user.codeErr = '';
    this.onCancel();
  }

  onDelCodeBlur() {
    if (this.user.code) {
      this.user.codeNull = '';
      this.user.codeErr = this.user.code.length === 4 ? '' : '请输入正确的验证码';
    } else {
      this.user.codeNull = '验证码不能为空';
    }
     
    
    return !(this.user.codeNull || this.user.codeErr);
  }
  onDelCodeFocus() {
    this.user.codeNull = '';
    this.user.codeErr = '';
  }

  onCancel(){
    this.showDelWin = false;
  }

  

  onChangeProvince(id, item) {
    item.provinceId = id;
    this.formValid = false;
    if (id && id !== 'undefined') {
      item.valid.provinceId = true;
      this.getCity(id, item);
    } else {
      item.valid.provinceId = false;
    }
    item.showTip.provinceId = id === 'undefined' ? true : false;
    
  }
  onChangeCity(id, shop) {
    shop.cityId = id;
    if (id && id !== 'undefined') {
      shop.valid.cityId = true;
    } else {
      shop.valid.cityId = false;
    }
    shop.showTip.cityId = id === 'undefined' ? true : false;
    this.formValid = this.formRequiredValid();
  }

  AssemblyServiceId(data) {
    this.errorServiceType = 1;
    let ay = [];
    let list = [];
    _.forEach(data, (val, i) => {
      _.forEach(this.shopList[i].sList, (sub, j) => {
        if (sub.checked) {
          list.push(sub.id);
          this.errorServiceType = 0;
        }
      })
      val.serviceIds = list.join(',');
      ay.push(val);
    })
    return ay;
  }

  onResigerShop() {
    this.loading = 1;
    let data = this.shopList;
    let post = this.AssemblyServiceId(data);
    if (this.errorServiceType) {
      this.errorServiceType = 0;
      this.loading = 0;
      return false;
    }
    // payload: models.Shop
    post.forEach( shop => {
      shop.station = !shop.station || shop.station === 'undefined' ? null : shop.station;
      shop.openingDate = !shop.openingDate || shop.openingDate === 'undefined' ? null : shop.openingDate;
    } );
    if (this.id) {
      post[0].id = this.id;
      this.sApi.shopUpdatePost(post[0]).subscribe(data => {
        this.loading = 0;
        if (data.meta.code === 200) {
          this.success.next(data.data);
        } else {
          alert(data.error.message);
        }
      }, err => console.log(err));
    } else {
      this.sApi.shopBatchSavePost(post).subscribe(data => {
        this.loading = 0;
        if (data.meta.code === 200) {
          this.success.next(data.data);
          this.missionService.announceMission('update-store-list');
        } else {
          alert(data.error.message);
        }
      });
    }

  }

  formRequiredValid() {
    for (let shop of this.shopList) {
      if ( !(shop.valid.name && shop.valid.provinceId && shop.valid.cityId && shop.valid.address && shop.valid.serverType && shop.valid.area) ) {
        return false;
      }
    }
    return true;
  }
  
// 面积的验证是反的
  onStoreAreaBlur(shop) {
    if (shop.area === undefined || shop.area === '') {
      shop.valid.area = true;
      shop.showTip.area = true;
      this.formValid = this.formRequiredValid();
      return;
    }
    shop.valid.area = /^\d+(\.\d+)?$/.test(shop.area) && shop.area >= 1 && shop.area < 1000000000 ? true : false;
    shop.showTip.area = shop.valid.area ? true : false;
    this.formValid = this.formRequiredValid();
  }
  onStoreAreaFocus(shop) {
    shop.valid.area = true;
    shop.showTip.area = true;

  }
  onStoreAreaChange(shop, evt) {
    shop.area = evt ? evt : '';
    shop.valid.area = (shop.area === '' || (/^\d+(\.\d+)?$/.test(shop.area) && shop.area >= 1 && shop.area < 1000000000) ) ? true : false;
    this.formValid = this.formRequiredValid();
  }
  onShopNameSet($event, shop) {
    console.log(arguments);
    shop.name = $event;
    shop.valid.name = shop.name ? true : false;
    this.formValid = this.formRequiredValid();
  }
  onShopNameBlur(shop) {
    shop.valid.name = shop.name ? true : false;
    shop.showTip.name = shop.valid.name ? false : true;
    console.log('name blur', shop);
    this.formValid = this.formRequiredValid();
  }
  onShopNameFocus(shop) {
    shop.showTip.name = false;
  }
  onShopAddressSet($event, shop) {
    console.log(arguments);
    shop.address = $event;
    shop.valid.address = shop.address ? true : false;
    this.formValid = this.formRequiredValid();
  }
  onShopAddressBlur(shop) {
    shop.valid.address = shop.address ? true : false;
    shop.showTip.address = shop.valid.address ? false : true;
    console.log('address blur', shop);
    this.formValid = this.formRequiredValid();
  }
  onShopAddressFocus(shop) {
    shop.showTip.address = false;
  }
  selectServerType (shop, type, evt) {
    type.checked = evt;
    if (type.checked) {
      shop.valid.serverType = true;
      shop.showTip.serverType = false;
      this.formValid = this.formRequiredValid();
      return;
    }
    let hasChecks = shop.sList.filter(sl => sl.checked);
    console.log(hasChecks);
    if (hasChecks.length > 0) {
      shop.valid.serverType = true;
      shop.showTip.serverType = false;
      this.formValid = this.formRequiredValid();
    } else {
      shop.valid.serverType = false;
      shop.showTip.serverType = true;
      this.formValid = false;
    }
    
    
  }

}
