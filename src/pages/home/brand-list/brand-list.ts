import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events, Content, IonicPage, FabButton } from 'ionic-angular';
import { HttpService } from "../../../providers/http-service";
import { Native } from "../../../providers/native";

/*
  Generated class for the BrandList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
	selector: 'page-brand-list',
	templateUrl: 'brand-list.html',
})
export class BrandListPage {
	data: any;
	goodsCount: any;//购物车商品数量
	myHomeSearch = null;
	listStyleflag: Boolean;//列表样式切换
	mytool = 'all';//当前筛选

	paramsData = {
		size: 30,
		page: 1,
		brand_id: null,
		cat_id: null,
		order: null,
		stort: 'DESC',
		keywords: this.myHomeSearch,
		supplier_id: null
	}
	@ViewChild(Content) content: Content;
	@ViewChild('scrollToTop') fabButton: FabButton;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public httpService: HttpService,
		public events: Events,
		public native: Native
	) { }
	ionViewDidLoad() {
		console.log('ionViewDidLoad BrandListPage');
		this.paramsData.cat_id = this.navParams.get('listId');
		this.paramsData.brand_id = this.navParams.get('brandId');
		this.paramsData.supplier_id = this.navParams.get('supplierId');
		this.paramsData.keywords = this.navParams.get('keyword');
		this.myHomeSearch = this.paramsData.keywords;
		console.log('列表ID:', this.paramsData.cat_id);
		console.log('品牌ID:', this.paramsData.brand_id);
		console.log('supplier_id:', this.paramsData.supplier_id);
		console.log('keywords:', this.paramsData.keywords);

		this.getListData();
		this.getCarNumver();
		this.events.subscribe('user:filterParams', (res) => {
			this.paramsData = Object.assign(this.paramsData, res);
			console.log(this.paramsData)
			this.data.page = 1;
			this.mytool = 'all';
			this.paramsData.stort = 'DESC';
			this.getListData();
		});
		this.events.subscribe('car:updata', () => {
			this.getCarNumver();
		});
	}
	ionViewDidLeave() {
		this.events.unsubscribe('user:filterParams');//防止多次订阅事件
	}
	ngAfterViewInit() {
		this.content.ionScroll.subscribe((d) => {
			this.fabButton.setElementClass("fab-button-out", d.directionY == "down");
		});
	}
	ngAfterViewChecked() {
		this.content.resize();
	}
	ngOnDestroy() {
		//退出页面取消事件订阅
		this.events.unsubscribe('user:filterParams');
		this.events.unsubscribe('car:updata');
	}
	getListData(params?) {
		this.httpService.categoryGoods(Object.assign(this.paramsData, params)).then((res) => {
			if (res.status == 1) {
				this.data = res;
				if (res.goods.length == 0) {
					this.native.showToast('抱歉！没有查询到商品', null, false);
				}
				this.events.publish('user:listFilter', res);
			}
		})
	}
	doRefresh(refresher) {
		this.httpService.categoryGoods(this.paramsData).then((res) => {
			if (res.status == 1) {
				this.data = res;
			}
			setTimeout(() => {
				refresher.complete();
			}, 500);
		})
		this.getCarNumver();
	}
	// flag: boolean = true;
	// doInfinite(infiniteScroll) {
	// 	if (this.data.page < this.data.pages) {
	// 		let pagingParam = Object.assign(this.paramsData, { page: ++this.data.page });
	// 		this.httpService.categoryGoods(pagingParam).then((res) => {
	// 			if (res.status == 1) {
	// 				Array.prototype.push.apply(this.data.goods, res.goods);
	// 			}
	// 			setTimeout(() => {
	// 				infiniteScroll.complete();
	// 			}, 500);
	// 		})
	// 	} else {
	// 		this.flag = false;
	// 	}
	// }
	getCarNumver() {
		this.httpService.getFlowGoods().then((res) => {
			if (res.status == 1) {
				this.goodsCount = res.goods_count;
			}
		})
	}
	onInput(event) {
		this.searchGoods()
	}
	searchGoods() {
		this.data.page = 1
		this.paramsData = {
			size: 30,
			page: 1,
			brand_id: null,
			cat_id: null,
			order: null,
			stort: 'DESC',
			keywords: this.myHomeSearch,
			supplier_id: null
		}
		this.httpService.categoryGoods(this.paramsData).then((res) => {
			this.data = res;
			this.events.publish('user:listFilter', res);
		})
	}
	allStatus = true;
	salesNumStatus = true;
	shopPriceStatus = true;
	mytoolChange() {//——_——|||.....
		if (this.mytool == 'all') {
			this.paramsData.order = '';
			this.salesNumStatus = true;
			this.shopPriceStatus = true;
			if (this.allStatus) {
				this.paramsData.stort = 'ASC';
				this.allStatus = false;
				this.getListData();
			} else {
				this.allStatus = true;
				this.paramsData.stort = 'DESC';
				this.getListData();
			}
		}
		if (this.mytool == 'sales_num') {
			this.paramsData.order = 'sales_num';
			this.shopPriceStatus = true;
			this.allStatus = true;
			if (this.salesNumStatus) {
				this.paramsData.stort = 'ASC';
				this.salesNumStatus = false;
				this.getListData();
			} else {
				this.salesNumStatus = true;
				this.paramsData.stort = 'DESC';
				this.getListData();
			}
		}
		if (this.mytool == 'shop_price') {
			this.paramsData.order = 'shop_price';
			this.salesNumStatus = true;
			this.allStatus = true;
			if (this.shopPriceStatus) {
				this.paramsData.stort = 'ASC';
				this.shopPriceStatus = false;
				this.getListData();
			} else {
				this.shopPriceStatus = true;
				this.paramsData.stort = 'DESC';
				this.getListData();
			}
		}
	}
	previousPage() {
		if (this.data.page > 1) {
			let pagingParam = Object.assign(this.paramsData, { page: --this.data.page });
			this.httpService.categoryGoods(pagingParam).then((res) => {
				this.data = res;
			})
		}
	}
	nextPage() {
		if (this.data.page < this.data.pages) {
			let pagingParam = Object.assign(this.paramsData, { page: ++this.data.page });
			this.httpService.categoryGoods(pagingParam).then((res) => {
				this.data = res;
			})
		}
	}
	scrollToTop() {
		this.content.scrollToTop();
	}
	goCarPage() {
		this.navCtrl.push('CarPage');
	}
}
