import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, IonicPage, FabButton, Events, AlertController } from 'ionic-angular';
import { HttpService } from "../../../providers/http-service";
import { Native } from "../../../providers/native";
import { phone_nember } from '../../../providers/constants';
import { MineProvider } from '../../../providers/mine/mine';
/*
  Generated class for the AllOrders page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
	selector: 'page-all-orders',
	templateUrl: 'all-orders.html'
})
export class AllOrdersPage {
	infiniteScroll: any;
	orderList: any;
	pageIndex: number = this.navParams.get('index') || 0;
	orderData: any;

	@ViewChild(Content) content: Content;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public httpService: HttpService,
		public native: Native,
		public events: Events,
		private alertCtrl: AlertController,
		private mine: MineProvider,
	) {
		this.events.subscribe('allOrders:update', () => {
			this.getByPageIndex();
		})
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad AllOrdersPage');
	}
	ionViewDidLeave() {
		this.infiniteScroll = null;
	}
	ngAfterViewInit() {
	}
	ngOnInit() {
		this.getByPageIndex();
	}
	getByPageIndex() {
		if (this.infiniteScroll) this.infiniteScroll.enable(true);
		let type: string;
		switch (this.pageIndex) {
			case 0: type = ''; break;
			case 1: type = 'unpay'; break;
			case 2: type = 'send'; break;
			case 3: type = 'collect'; break;
			case 4: type = 'ok'; break;
			case 5: type = 'cancel'; break;
			default: type = ''; break;
		}
		return this.httpService.order({ page: 1, type: type }, { showLoading: true }).then((res) => {
			if (res.status == 1) {
				// this.orderData_all = res;
				this.orderData = res;
				this.orderList = res.list;
			}
		})
	}
	/*下拉刷新*/
	doRefresh(refresher) {
		this.getByPageIndex().then(() => {
			setTimeout(() => {
				refresher.complete();
			}, 500);
		})
	}
	checkTab($event) {
		this.infiniteScroll ? this.infiniteScroll.enable(true) : null;
		this.pageIndex = $event;
		this.content.scrollToTop(0);
		this.getByPageIndex();
	}
	goOrdersDetailPage(orderId) {
		this.navCtrl.push('OrdersDetailPage', { order_id: orderId });
	}
	goParticularsPage(id) {
		this.navCtrl.push('ParticularsPage', { goodsId: id });
	}
	doInfinite(infiniteScroll) {
		let type: string;
		switch (this.pageIndex) {
			case 0: type = ''; break;
			case 1: type = 'unpay'; break;
			case 2: type = 'send'; break;
			case 3: type = 'collect'; break;
			case 4: type = 'ok'; break;
			case 5: type = 'cancel'; break;
			default: type = ''; break;
		}
		this.infiniteScroll = infiniteScroll;
		if (this.orderData.page < this.orderData.pages) {
			var p = this.orderData.page;
			this.httpService.order({ page: ++p, type: type }, { showLoading: false }).then((res) => {
				if (res.status == 1) {
					this.orderData = res;
					this.orderList = this.orderList.concat(res.list);
				}
				setTimeout(() => {
					this.infiniteScroll.complete();
				}, 500);
			})
		} else {
			this.infiniteScroll.enable(false);
		}
	}
	toPay(id) {
		if (!this.mine.canCheckout) { this.native.showToast('暂无结算权限，请联系企业管理员'); return false }

		this.navCtrl.push('PaymentMethodPage', { order_id: id })
	}
	confirmReceipt(order_id) {
		this.native.openAlertBox('确认收货', () => {
			this.httpService.affirmReceived({ order_id: order_id }).then((res) => {
				if (res.status == 1) {
					this.native.showToast('订单操作成功');
					this.getByPageIndex();
				}
			})
		})
	}
	orderTracking(order_id) {
		this.native.showToast('敬请期待');
	}
	cancelOrder(order_id) {
		this.native.openAlertBox('是否取消订单', () => {
			this.httpService.cancelOrder({ order_id: order_id }).then((res) => {
				if (res.status == 1) {
					this.native.showToast('订单操作成功');
					this.getByPageIndex();
				}
			})
		})
	}
	deleteOrder(id, index) {
		this.native.openAlertBox('删除订单', () => {
			this.httpService.delOrder({ order_id: id }).then((res) => {
				if (res.status == 1) {
					this.orderList.splice(index, 1);
					this.native.showToast(res.data);
				}
			})
		})
	}
	goParticularsHomePage(id) {
		this.navCtrl.push('ParticularsHomePage', { suppliersId: id })
	}
	goAddProcess(order_parent) {
		this.navCtrl.push('AddProcessPage', { order_parent: order_parent })
		// this.native.showToast('暂未开放',null,false);
	}
	buyAgain(order_id) {
		this.httpService.alignBuy({ order_id: order_id }).then((res) => {
			if (res.status) {
				this.navCtrl.push('CarPage');
			} else if (res.status == -2) {
				this.alertCtrl.create({
					title: '镜库科技',
					message: '购买需上传医疗器械许可证，是否上传',
					buttons: [
						{
							text: '确定',
							handler: () => {
								this.navCtrl.push('CompanyInfoPage');
							}
						},
						{
							text: '取消',
						}
					]
				}).present();
			}
		})
	}
}
