import { Component } from '@angular/core';
import { NavController, NavParams, Events, IonicPage } from 'ionic-angular';
import { HttpService } from "../../../../providers/http-service";
import { Native } from "../../../../providers/native";

/*
  Generated class for the InvoiceQualification page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage({
  segment:"invoice-qualification/:ivid"
})
@Component({
  selector: 'page-invoice-qualification',
  templateUrl: 'invoice-qualification.html'
})
export class InvoiceQualificationPage {
  formData = {
    ivid: this.navParams.get('ivid') || null,
    type: '1',
    payee: null,
    inv_type: '1',
    company: null,
    sw_sn: null,
    bank_name: null,
    bank_sn: null,
    address: null,
    tel: null,
    yyzz: null,//执照复印件
    // swdj: null,//税务登记复印件
    // zgez: null//资格认证复印件
    taxpayer_num: null
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    private native: Native,
    private events: Events
  ) {
    if (this.navParams.get('ivid')) {
      this.getFormData();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoiceQualificationPage');
  }
  getFormData() {
    this.httpService.updateInv({ ivid: this.navParams.get('ivid') }).then((res) => {
      if (res.status == 1) {
        this.formData.type = res.data.type;
        this.formData.payee = res.data.payee;
        this.formData.inv_type = res.data.inv_type;
        this.formData.company = res.data.company;
        this.formData.sw_sn = res.data.sw_sn;
        this.formData.bank_name = res.data.bank_name;
        this.formData.bank_sn = res.data.bank_sn;
        this.formData.address = res.data.address;
        this.formData.tel = res.data.tel;
        this.formData.yyzz = res.data.yyzz;
        this.formData.taxpayer_num = res.data.taxpayer_num;
        // this.formData.swdj = res.data.swdj;
        // this.formData.zgez = res.data.zgez;
      }
    })
  }

  add() {
    this.httpService.updateInvPost(this.formData).then((res) => {
      if (res.status == 1) {
        this.native.showToast(res.info);
        this.navCtrl.pop();
        this.events.publish('receipt:update');
      }
    })
  }

  openFile(type) {
    this.native.getPictureByPhotoLibrary().then((res) => {
      if (type === 1) {
        this.formData.yyzz = 'data:image/jpeg;base64,' + res;
      } else if (type === 2) {
        // this.formData.swdj = 'data:image/jpeg;base64,' + res;
      } else if (type === 3) {
        // this.formData.zgez = 'data:image/jpeg;base64,' + res;
      }
    })
  }
}
