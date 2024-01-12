import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendLogsPageRoutingModule } from './send-logs-routing.module';

import { SendLogsPage } from './send-logs.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendLogsPageRoutingModule,
    HeaderComponentModule
  ],
  declarations: [SendLogsPage]
})
export class SendLogsPageModule {}
