import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmPage } from './crm';
import { ImgLazyLoadDirectiveModule } from '../../../directives/img-lazy-load/img-lazy-load.module';
import { SwiperNewmComponentModule } from '../../../components/swiper-newm/swiper-newm.module';
import { FooterRightsComponentModule } from '../../../components/footer-rights/footer-rights.module';
import { WelHeaderComponentModule } from '../../../components/wel-header/wel-header.module';
import { ScrollToTopDirectiveModule } from '../../../directives/scroll-to-top/scroll-to-top.module';

@NgModule({
   declarations: [
      CrmPage,
   ],
   imports: [
      IonicPageModule.forChild(CrmPage),
      ImgLazyLoadDirectiveModule,
      SwiperNewmComponentModule,
      FooterRightsComponentModule,
      WelHeaderComponentModule,
      ScrollToTopDirectiveModule
   ],
   exports: [
      CrmPage
   ]
})
export class CrmPageModule { }
