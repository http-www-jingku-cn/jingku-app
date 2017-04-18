import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Alipay, AlipayOrder } from '@ionic-native/alipay';

@Component({
  selector: 'page-presell',
  templateUrl: 'presell.html'
})
export class PresellPage {
  payInfo: any;
  payResult: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alipay: Alipay
  ) {
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PresellPage');
  }
  goToPay() {
 // Should get from server side with sign.
    const alipayOrder: AlipayOrder = {
      /**
     * appId assigned by Alipay
     */
      app_id: '',
      /**
       * Api name.
       * Should be: alipay.trade.app.pay
       */
      method: '',
      /**
       * Data format
       * Default: "JSON"
       */
      format: '',
      /**
       * Charset
       * Possible values: "UTF-8", "GBK"
       * Default: "UTF-8"
       */
      charset: '',
      /**
       * Sign method
       * Default: 'RSA'
       */
      sign_type: '',
      /**
       * Sign value. Should be got from server side.
       * Default: 'RSA'
       */
      sign: '',
      /**
       * Timestamp, formated like "yyyy-MM-dd HH:mm:ss", e.g. 2014-07-24 03:07:50
       */
      timestamp: '',
      /**
       * Api version. Fixed value '1.0'
       */
      version: '',
      /**
       * Notify url.
       */
      notify_url: '',
      /**
       * biz content. formated in json. see alipay doc for detail.
       */
      biz_content: ''
    };
    this.alipay.pay(alipayOrder)
      .then(res => {
        console.log('seccuss',res);
        this.payResult = res;
      }, err => {
        console.log('err',err);
        this.payResult = err;
      })
      .catch(e => {
        console.log('错误',e);
        this.payResult = e;
      });
  }
}