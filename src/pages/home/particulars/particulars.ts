import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
/*http服务*/
import { HttpService } from "../../../providers/http-service";

import { ParticularsModalPage } from "./particulars-modal/particulars-modal"
/*
  Generated class for the Particulars page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-particulars',
  templateUrl: 'particulars.html'
})
export class ParticularsPage {
  private getGoodsGallery;
  private getPriceSection;
  private getGoodsInfo;
  private getGoodsParameter;
  private getGoodsSaleCity;
  private getSupplierInfo;
  private getBonus;
  private sendByUser;
  private getGoodsFittings;
  private collectDel;
  private searchGoods;
  private care;

  private selectGroupRecommend = "group";
  private selectPicArguments = "pic";

  private goodsId:number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpService,
    public modalCtrl: ModalController
  ) {
    this.goodsId = this.navParams.get('goodsId');
  }
  presentModal(str, evt) {
    if (evt) {evt.stopPropagation()}
    let modal = this.modalCtrl.create(ParticularsModalPage, { name: str, getBonus: this.getBonus,sendto:this.getGoodsSaleCity });
    modal.onDidDismiss(data => {
      console.log(data);
    });
    modal.present();
  }
  ngOnInit() {
    this.http.getGoodsGallery({ goods_id: this.goodsId }).then((res) => {
      console.log("商品详情的相册图片轮播", res);
      this.getGoodsGallery = res.data;
    });
    this.http.getPriceSection({ goods_id: this.goodsId }).then((res) => {
      console.log("获取商品价格优惠区间", res);
      this.getPriceSection = res;
    });
    this.http.getGoodsInfo({ goods_id: this.goodsId }).then((res) => {
      console.log("商品详情信息", res);
      this.getGoodsInfo = res.data;
    });
    this.http.getGoodsParameter({ goods_id: this.goodsId }).then((res) => {
      console.log("获取商品参数", res);
      this.getGoodsParameter = res.data;
      // console.log(JSON.stringify(res.data))
    });
    this.http.getGoodsSaleCity({ goods_id: this.goodsId }).then((res) => {
      console.log("获取商品的销售区域", res);
      this.getGoodsSaleCity = res.data;
    });
    this.http.getSupplierInfo({ goods_id: this.goodsId }).then((res) => {
      console.log("获取供应商信息", res);
      this.getSupplierInfo = res.data;
    });
    this.http.getBonus({ goods_id: this.goodsId }).then((res) => {
      console.log("优惠券列表", res);
      this.getBonus = res.data;
    });
    this.http.sendByUser({ goods_id: this.goodsId }).then((res) => {
      console.log("领取优惠券", res);
      this.sendByUser = res.data;
    });
    this.http.getGoodsFittings({ goods_id: this.goodsId }).then((res) => {
      console.log("组合商品、关联商品", res);
      this.getGoodsFittings = res.data;
    });
    this.http.searchGoods({ goods_id: this.goodsId }).then((res) => {
      console.log("商品搜索列表页", res);
      this.searchGoods = res.data;
    });
  }
  ngOnChanges() {

  }
  beCareFor() {
    if (this.getGoodsInfo.is_collect) {
      this.http.collectDel({ goods_id: 3994 }).then((res) => {
        console.log("取消商品关注", res);
        if (res.status) {
          this.getGoodsInfo.is_collect = 0;
        }
      });
    } else {
      this.http.getGoodsCollect({ goods_id: 3994 }).then((res) => {
        console.log("商品关注", res);
        if (res.status) {
          this.getGoodsInfo.is_collect = 1;
        }
      });
    }
  }
  ngAfterViewInit() {

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ParticularsPage');
  }

}