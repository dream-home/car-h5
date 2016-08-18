import { Component, Input, Output, NgZone, OnChanges, SimpleChange, DoCheck } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {  ControlGroup, FormBuilder, Control } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { UserApi, CommonApi, CustomerApi, Customer } from 'client';
import { MainLogoComponent, PageFooterComponent, NavbarComponent, MenusComponent } from 'common';
import { Subject } from 'rxjs/Subject';

@Component({
	moduleId: module.id,
	selector: 'customer-form',
	template: require('./customerForm.html'),
	styles: [require('./customerForm.scss')],
	directives: [ROUTER_DIRECTIVES,  NavbarComponent, MenusComponent],
	providers: [HTTP_PROVIDERS, UserApi, CommonApi, Md5, CustomerApi ]
})

export class CustomerFormComponent {
  @Input() customer: Customer;
	customerForm: ControlGroup;
	vehiclePlateNull: Boolean = false;
	vehiclePlateLen: Boolean = false;
	vehiclePlateHas: Boolean = false;
	mobileFormatValid: Boolean = false;
	birthdayYearArr: number[] = [];
	vehicleYearArr: any[] = [];
	miles: string[] = [];
	active: Boolean = true;
	submitting: Boolean = false;
	customerDefault: any;
	customerCurrent: any;
	customerOldString: string = '';
	searchTermStream = new Subject<string>();
	tempPlate: string = '';
	items: Observable<any> = this.searchTermStream
			.debounceTime(500)
			.distinctUntilChanged()
			.switchMap((term: string, i) => {
				console.log('term: ', term, i);
				return this.cApi.customerVehicleVehicleLicenceGet(encodeURI(term));
			});
	hasSave: boolean = false;
	constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private cApi: CustomerApi) {

		const currentYear = +(new Date()).getFullYear();
		this.birthdayYearArr = this.rangeArr(currentYear - 60, currentYear - 16).reverse();
		this.vehicleYearArr = this.rangeArr(2006, currentYear).reverse();
		this.vehicleYearArr.push('2005年及以前');
		this.miles = [
			'5,000公里',
			'10,000公里',
			'15,000公里',
			'20,000公里',
			'25,000公里',
			'30,000公里',
			'35,000公里',
			'40,000公里',
			'45,000公里',
			'50,000公里',
			'55,000公里',
			'60,000公里',
			'65,000公里',
			'70,000公里',
			'75,000公里',
			'80,000公里',
			'85,000公里',
			'90,000公里',
			'95,000公里',
			'100,000公里及以上'
		];
		this.customerDefault = {
			'id': '',
			'vehicleLicence': '',
			'mobile': '',
			'vehicleFrame': '',
			'name': '',
			'birthYear': '',
			'gender': '',
			'vehicleBrand': '',
			'vehicleModel': '',
			'vehicleYear': '',
			'vehicleMiles': ''
		}


	}

	ngOnInit() {
		this.initFb();
		this.items.subscribe(data => {
			const val = this.customerCurrent.vehicleLicence;
			if (this.tempPlate === val) {
				this.vehiclePlateHas = data && data.data ? true : false;
			} else {
				this.subjectAjax();
			}

		});
	}

	ngOnDestroy() {
		console.log('destroy');
		// this.items.unsubscribe();
	}

	ngOnChanges( changes ) {
		console.log('changes: ', changes);
	}

	// ngDoCheck() {
	// 	console.log('Check: ', this.customerCurrent);
	// 	let current = Md5.hashStr(JSON.stringify(this.customerCurrent), false).toString();
	// 	GlobalVar.needFormSave = this.customerOldString === current ? false : true;
	// 	console.log('', GlobalVar.needFormSave);
	// }

	// canDeactivate(): Observable<boolean> | boolean {
	// 	let current = Md5.hashStr(JSON.stringify(this.customerCurrent), false).toString();
	// 	console.log(this.customerOldString, current );
	// 	if ( this.customerOldString === current ) {
	// 		return true;
	// 	}
	// 	let p = this.dialogService.confirm('当前页面尚有信息未保存，是否离开？点击确定则显示搜索结果，点击取消还原原页面');
	// 	let o = Observable.fromPromise(p);
	// 	return o;
	// }

	hasChange() {
		let current = Md5.hashStr(JSON.stringify(this.customerCurrent), false).toString();
		return this.hasSave || this.customerOldString === current;
	}

	initFb() {
		console.log('this_customer: ', this.customer);
		this.customerCurrent = Object.assign({}, this.customer || this.customerDefault);
		this.customerOldString = Md5.hashStr(JSON.stringify(this.customerCurrent), false).toString();
		console.log('customerOldString', this.customerOldString);

		this.active = false;
        setTimeout(() => this.active = true, 0);
	}

	rangeArr (start, end) {
        return Array(end - start + 1).fill(0).map((v, i) => i + start);
    }
	// 去顾客列表页
	gotoListPage() {
		this.router.navigate(['/dashbroad/customer-list']);
	}
	gotoDetailPage(id) {
		this.router.navigate(['/dashbroad/customer-detail', {id: id}]);
	}

	onCancel() {
		this.customer.id ? this.gotoDetailPage(this.customer.id) : this.gotoListPage();
	}

	onSave( other ) {
		const willAddNew = other || false;
		const isNew = this.customer.id ? false : true;
		this.vehiclePlateValid();
		if (this.vehiclePlateNull || this.vehiclePlateLen || this.vehiclePlateHas ) {
			return;
		}
		this.onMobileValid();
		console.log('this.mobileFormatValid', this.mobileFormatValid)
		if (this.mobileFormatValid) {
			return;
		}

		if (this.submitting) return;
		this.submitting = true;
		let vals = this.customerCurrent;
		this.cApi.customerSaveOrUpdatePost(
			vals.vehicleLicence || '',
			vals.id || '',
			vals.mobile || '',
			vals.vehicleFrame || '',
			vals.name || '',
			vals.birthYear || '',
			vals.gender || '',
			vals.vehicleBrand  || '',
			vals.vehicleModel  || '',
			vals.vehicleYear  || '',
			vals.vehicleMiles  || ''
		).subscribe(data => {
			this.submitting = false;
			this.tempPlate = '';
			if (data.meta.code === 200 && data.data) {
				// 需要继续创建
				if (isNew && willAddNew) {
					this.initFb();
					return;
				}
				// 添加一次
				this.hasSave = true;
				if (isNew) {
					this.gotoListPage();
				} else {
					// 更新
					alert('修改成功');
					this.gotoDetailPage(this.customer.id);
				}

			} else {
				if (data.error && data.error.message) {
					alert(data.error.message);
				}
			}
		}, err => {
			console.error(err)
			this.submitting = false;
		} );

	}

	vehiclePlateValid() {
		let vehicleLicence = this.customerCurrent.vehicleLicence;
		console.log(vehicleLicence)
		if (vehicleLicence === '') {
			this.vehiclePlateNull = true;
			return false;
		}
		this.vehiclePlateNull = false;
		if ( vehicleLicence.length < 7 || vehicleLicence.length > 9 ) {
			this.vehiclePlateLen = true;
			return false;
		}
		this.vehiclePlateLen = false;
		return true;
	}
	
	onMobileValid() {
		if (this.customerCurrent.mobile) {
			this.mobileFormatValid = /^(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/.test(this.customerCurrent.mobile) ? false : true;
		}
	}
	onMobileFocus() {
		this.mobileFormatValid = false;
	}
	onVehiclePlateFocus() {
		this.vehiclePlateNull = false;
		this.vehiclePlateLen = false;
		// this.vehiclePlateHas = false;
	}
	onVehiclePlateBlur() {
		const val = this.customerCurrent.vehicleLicence;
		if (!val) {
			this.vehiclePlateNull = true;
			return false;
		}
		if (val.length < 7) {
			this.vehiclePlateLen = true;
			return false;
		}
	}

	subjectAjax() {
		const val = this.customerCurrent.vehicleLicence;
		this.vehiclePlateLen = false;
		this.vehiclePlateHas = false;
		console.log(val);
		console.log(this.customer.vehicleLicence)
		if (this.customerCurrent.id && val === this.customer.vehicleLicence) {
			return;
		}
		if ( val.length > 6 && val.length < 10 ) {
			this.tempPlate = val;
			this.searchTermStream.next(val);
		} else if (val.length >= 10) {
			this.vehiclePlateHas = false;
			this.vehiclePlateLen = true;
		}
	}

}
