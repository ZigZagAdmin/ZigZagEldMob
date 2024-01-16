import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogCertifyPageRoutingModule } from './log-certify-routing.module';

import { LogCertifyPage } from './log-certify.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';


@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, LogCertifyPageRoutingModule, HeaderComponentModule],
  declarations: [LogCertifyPage],
})
export class LogCertifyPageModule {}
