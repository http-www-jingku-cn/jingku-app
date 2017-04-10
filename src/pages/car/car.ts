import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, Events, Content } from 'ionic-angular';
import { Native } from "../../providers/native";
import { HttpService } from "../../providers/http-service";
import { HomePage } from "../home/home";
import { WriteOrdersPage } from "../my/all-orders/write-orders/write-orders";

/*
  Generated class for the Car page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-car',
  templateUrl: 'car.html'
})
export class CarPage {
  HomePage: any = HomePage
  isEdit: boolean = false;
  carDetails: any;
  @ViewChild(Content) content: Content;

  checkedArray: Array<number> = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public native: Native,
    public alertCtrl: AlertController,
    public httpService: HttpService,
    public events: Events,
  ) {
    this.getFlowGoods();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CarPage');
  }
  getFlowGoods(finished?) {
    this.httpService.getFlowGoods().then((res) => {
      console.log(res)
      if (res.status == 1) {
        this.carDetails = res;
        this.content.resize();
        this.checkAll();
        //购物车商品数量
        this.events.publish('car:goodsCount', res.total.real_goods_count);
      }
      if (finished) { finished(); }
      // this.carDetails.selected = true;
      // this.calculateTotal();
    })
  }
  /*下拉刷新*/
  doRefresh(refresher) {
    this.getFlowGoods(function () {
      setTimeout(() => {
        refresher.complete();
      }, 500);
    })
  }
  deleteItem(item3) {
    let confirm = this.alertCtrl.create({
      cssClass: 'alert-style',
      subTitle: '确认删除该商品吗？',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确认',
          handler: () => {
            console.log('Agree clicked');
            this.httpService.dropCartGoods({ rec_id: item3.rec_id }).then((res) => {
              if (res.status == 1) {
                this.getFlowGoods();
                this.native.showToast('删除成功~')
              }
            })
          }
        }
      ],
    });
    confirm.present();
  }
  numberChangeI(event, item) {
    item.goods_number = event;
    this.httpService.changeNumCart({ rec_id: item.rec_id, number: event }).then((res) => {
      console.log(res)
      if (res.status == 1) {
        item.inputLock = false;
        this.getFlowGoods();
      } else {
        item.goods_number = item.goods_number - 1;
        item.inputLock = true;
      }
    });
    // this.calculateTotal();
  }
  checkGoods(item) {
    let index = this.checkedArray.indexOf(item.rec_id);
    if (index == -1) {
      for(var i =0 ;i <item.attrs.length;i++){
        this.checkedArray.push(item.attrs[i].rec_id);
      }
    } else {
      for(var i =0 ;i <item.attrs.length;i++){
        this.checkedArray.splice(this.checkedArray.indexOf(item.attrs[i].rec_id), 1);
      }
    }
    this.httpService.selectChangePrice({ rec_ids: this.checkedArray }).then((res) => {
      console.log(res);
      if(res.status==1){
        this.carDetails.total.goods_amount = res.total;
      }
    })
    console.log(this.checkedArray);
  }
  checkAll() {
    this.checkedArray = [];//刷新完成之后清空选中商品
    this.carDetails.selected = true;
    for (let i = 0, item = this.carDetails.suppliers_goods_list; i < item.length; i++) {
      item[i].selected = true;
      for (let k = 0; k < item[i].goods_list.length; k++) {
        item[i].goods_list[k].selected = true;
      }
    }
    console.log(this.checkedArray)
  }
  beCareFor() {
    if (this.checkedArray != null) {
      this.native.showToast('请选择需要关注商品');
      return;
    }
    this.httpService.batchGoodsCollect({
      goods_ids: this.checkedArray
    }).then((res) => {
      console.log(res);
      if (res.status == 1) {
        this.native.showToast('关注成功~')
      }
    })
  }
  dropCartGoodsSelect() {
    if (this.checkedArray != null) {
      this.native.showToast('请选择需要删除商品');
      return;
    }
    this.native.openAlertBox('是否删除购物车选中商品？', () => {
      this.httpService.dropCartGoodsSelect({ goods_ids: this.checkedArray }).then((res) => {
        console.log(res);
        if (res.status == 1) {
          this.native.showToast('删除成功~')
          this.getFlowGoods();
        }
      })
    })
  }
  goAccounts() {
    this.navCtrl.push(WriteOrdersPage);
  }
  /*——————————————————————————————————————————————————————————————————*/
  /*  calculateTotal() {//购物车总价格
      let total = 0;
      let number = 0;
      for (let i = 0, item = this.carDetails.suppliers_goods_list; i < item.length; i++) {
        this.calculateShopPrice(item[i]);
        total += item[i].subtotal;
        number += item[i].number;
      }
      this.carDetails.total.goods_amount = total;
      this.carDetails.total.real_goods_count = number;
      this.event.publish('user:carNumber', number);
    }
    calculateShopPrice(items) {//购物车小计
      let subtotal = 0;
      let number = 0;
      for (let i = 0, item = items.goods_list; i < item.length; i++) {//单个店铺的所有商品
        for (let j = 0; j < item[i].attrs.length; j++) {//单个商品的所有属性
          subtotal += Number(item[i].attrs[j].goods_number) * Number(item[i].attrs[j].goods_price.substr(1));
          number += Number(item[i].attrs[j].goods_number)
        }
      }
      items.goods_price_total = subtotal;
      items.goods_count = number;
    }*/
}
