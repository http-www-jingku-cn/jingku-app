import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, FabButton, Events } from 'ionic-angular';
import { HttpService } from "../../providers/http-service";
import { Native } from "../../providers/native";

/**
 * Generated class for the RepairReturnPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-repair-return',
  templateUrl: 'repair-return.html',
})
export class RepairReturnPage {
  infiniteScroll: any;
  repair: any;
  order: any;

  applyTabs: string = 'apply' || 'applyLog';

  options = {
    size: 10,
    page: 1,
    order_sn: null
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpService,
    public native: Native,
    public events: Events,
  ) { }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RepairReturnPage');
    this.checkList();
    this.events.subscribe('repair-return:update', () => {
      this.checkList();
    })
  }
  ngOnDestroy() {
    this.events.unsubscribe('repair-return:update');
  }
  checkList(){
    if(this.infiniteScroll) this.infiniteScroll.enable(true);
    if(this.applyTabs == 'apply'){
      return this.httpService.orderRepair(this.options).then((res) => {
        if (res.status == 1) {
          this.order = res;
        }
      })
    }else if(this.applyTabs == 'applyLog'){
      return this.httpService.repairList(this.options).then((res) => {
        if (res.status == 1) {
          this.repair = res;
        }
      })
    }
  }
  searchOrder(e) {
    if (e.keyCode == 13) {
      this.checkList();
    }
  }
  doRefresh(refresher) {
    this.checkList().then((res) => {
      setTimeout(() => {
        refresher.complete();
      }, 500);
    });
  }
  doInfinite(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    if (this.applyTabs == 'apply') {
      if (this.order.page < this.order.pages) {
        this.httpService.orderRepair({ page: ++this.order.page, size: 10 }).then((res) => {
          if (res.status == 1) {
            Array.prototype.push.apply(this.order.list, res.list);
            this.infiniteScroll.complete();
          }
        })
      } else {
        this.infiniteScroll.enable(false);
      }
    }
    if (this.applyTabs == 'applyLog') {
      if (this.repair.page < this.repair.pages) {
        this.httpService.repairList({ page: ++this.repair.page, size: 10 }).then((res) => {
          if (res.status == 1) {
            Array.prototype.push.apply(this.repair.list, res.list);
            this.infiniteScroll.complete();
          }
        })
      } else {
        this.infiniteScroll.enable(false);
      }
    }
  }
  /**
   * 点击申请售后
   * @param order_id 订单id
   * @param goods 订单商品列表
   */
  goApplyServicePage(order_id, rec_id) {
    var rec_ids = [rec_id];

    this.navCtrl.push('ApplyServicePage', {
      order_id: order_id,
      rec_ids: rec_id
    })
  }
  /**
   * 复选框选中判断
   * @param subitem 订单项
   */
  checkbox(subitem) {
    /*  subitem.selected = true
     for (var i in item.goods) {
       if (item.goods[i].selected == false) {
         item.selected = true;
       }
     }
     console.log(this.order.list[0]) */
  }
  checkall(item) {

  }
  /**
   * 取消售后申请
   * @param id 
   */
  cancelApply(id) {
    this.native.openAlertBox('确认取消本次售后申请吗？', () => {
      this.httpService.cancelReturn({ id: id }).then((res) => {
        if (res.status == 1) {
          this.native.showToast('取消成功');
          this.checkList();
        }
      })
    })
  }
  goServiceOrderDetailsPage(return_id) {
    this.navCtrl.push('ServiceOrderDetailsPage', { return_id: return_id });
  }
}