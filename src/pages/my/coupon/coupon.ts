import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { HttpService } from "../../../providers/http-service";
import Swiper from 'swiper';

/*
  Generated class for the Coupon page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
   selector: 'page-coupon',
   templateUrl: 'coupon.html'
})
export class CouponPage {
   data: any;
   couponSelect = 1;//'' or over_time or use
   showmark: boolean;
   navSwiper: any;
   pageSwiper: any;
   activeIndex: any;
   category: any = [
      {
         name: '全部'
      }, {
         name: '商品券'
      }, {
         name: '店铺券'
      }, {
         name: '全平台券'
      }, {
         name: '运费券'
      }
   ];
   constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public httpService: HttpService
   ) {
      this.segmentChange()
   }

   ionViewDidLoad() {
      console.log('ionViewDidLoad CouponPage');
   }
   ngAfterViewInit() {
     
   }
   ionViewWillLeave() {
      this.showmark = false;
   }
   getPrivilege(suppliers_id) {
      if (suppliers_id == 0) {
         this.navCtrl.push('BrandListPage', { keyword: '镜库' })
      } else if (suppliers_id < 0) {
         this.navCtrl.push('BrandListPage', { keyword: '' })
      } else {
         this.navCtrl.push('ParticularsHomePage', { suppliersId: suppliers_id })
      }
   }
   segmentChange(couponSelect?) {
      this.couponSelect = couponSelect || 0;
      return this.httpService.getUserBonus({ bonus_type: this.couponSelect }).then((res) => {
         if (res.status == 1) {
            this.data = res;
         }
      })
   }
   /*下拉刷新*/
   doRefresh(refresher) {
      this.segmentChange().then(() => {
         setTimeout(() => {
            refresher.complete();
         }, 500);
      })
   }
}
