import { Component, ViewChild, ElementRef, Renderer, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Events, Content, IonicPage, FabButton, InfiniteScroll } from 'ionic-angular';
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
	timer: number;
	infiniteScroll: InfiniteScroll;
	data: any;
	goodsCount: any;//购物车商品数量
	myHomeSearch = null;
	listStyleflag: Boolean;//列表样式切换
	mytool = 'all';//当前筛选

	paramsData = {
		size: 30,
		page: 1,
		brand_id: null,
		cat_id: this.navParams.get('listId'),
		order: null,
		stort: 'DESC',
		keywords: this.myHomeSearch,
		supplier_id: null,
		type: null
	}
	@ViewChild(Content) content: Content;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public httpService: HttpService,
		public events: Events,
		public native: Native,
		public element: ElementRef,
		public renderer: Renderer,
		public ref: ChangeDetectorRef,
		
	) { }
	ionViewDidLoad() {
		console.log('ionViewDidLoad BrandListPage');
	}
	ngOnInit() {
		this.paramsData.cat_id = this.navParams.get('listId') || null;
		this.paramsData.brand_id = this.navParams.get('brandId') || null;
		this.paramsData.supplier_id = this.navParams.get('supplierId') || null;
		this.paramsData.keywords = this.navParams.get('keyword') || null;
		this.paramsData.type = this.navParams.get('type') || null;
		this.myHomeSearch = this.paramsData.keywords;
		console.log('cat_id:', this.paramsData.cat_id);
		console.log('brand_id:', this.paramsData.brand_id);
		console.log('supplier_id:', this.paramsData.supplier_id);
		console.log('keywords:', this.paramsData.keywords);
		console.log('type:', this.paramsData.type);

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
		this.events.subscribe('car:update', () => {
			this.getCarNumver();
		});
	}
	ionViewDidLeave() {
		this.events.unsubscribe('user:filterParams');//防止多次订阅事件
	}
	ngAfterViewInit() {
		var pagebtn = this.element.nativeElement.querySelector('#pagebtn');

		this.content.ionScroll.subscribe((d) => {
			clearTimeout(this.timer);
			this.renderer.setElementClass(pagebtn, 'fab-button-fadein', true);
		});
		this.content.ionScrollEnd.subscribe((d) => {
			this.timer = setTimeout(()=> {
				this.renderer.setElementClass(pagebtn, 'fab-button-fadein', false)
			}, 500);
		});
	}
	ngAfterViewChecked() {
		this.content.resize();
	}
	ngOnDestroy() {
		//退出页面取消事件订阅
		this.events.unsubscribe('user:filterParams');
	}
	getListData() {
		this.infiniteScroll ? this.infiniteScroll.enable(true) : null;
		return new Promise((resolve, reject) => {
			this.httpService.categoryGoods(Object.assign(this.paramsData, { page: 1 })).then((res) => {
				resolve()
				if (res.status == 1) {
					this.data = res;
					this.content.scrollToTop();
					if (res.goods.length == 0) {
						this.native.showToast('抱歉！没有查询到相关商品', null, false);
					}
					this.events.publish('user:listFilter', res);
				}
			}).catch(() => {
				reject()
			})
		})
	}
	doRefresh(refresher) {
		this.getCarNumver();
		this.getListData().then(() => {
			setTimeout(() => {
				refresher.complete();
			}, 500);
		})
	}
	doInfinite(infiniteScroll) {
		this.infiniteScroll = infiniteScroll;
		var page = this.data.page
		if (this.data.page < this.data.pages) {
			let pagingParam = Object.assign(this.paramsData, { page: ++this.data.page });
			this.httpService.categoryGoods(pagingParam).then((res) => {
				if (res.status == 1) {
					this.data.goods = this.data.goods.concat(res.goods);
				}
				setTimeout(() => {
					this.infiniteScroll.complete();
				}, 500);
			})
		} else {
			this.infiniteScroll.enable(false);
		}
	}
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
		this.data.page = 1;
		this.paramsData.page = 1;
		this.paramsData.keywords = this.myHomeSearch;
		this.getListData()
	}
	allStatus = true;
	salesNumStatus = true;
	shopPriceStatus = true;
	mytoolChange() {//——_——|||.....
		if (this.mytool == 'all') {
			/* this.paramsData.order = '';
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
			} */
			this.getListData();
		}
		if (this.mytool == 'sales_num') {
			this.paramsData.order = 'sales_num';
			this.allStatus = true;
			this.shopPriceStatus = true;
			if (!this.salesNumStatus) {
				this.paramsData.stort = 'ASC';
				this.salesNumStatus = true;
				this.getListData();
			} else {
				this.salesNumStatus = false;
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
	}/* 
	previousPage() {
		if (this.data.page > 1) {
			this.getListData({ page: --this.data.page })
		}
	}
	nextPage() {
		if (this.data.page < this.data.pages) {
			this.getListData({ page: ++this.data.page })
		}
	} */
	goCarPage() {
		this.navCtrl.push('CarPage');
	}
}
