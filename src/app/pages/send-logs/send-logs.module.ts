import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendLogsPageRoutingModule } from './send-logs-routing.module';

import { SendLogsPage } from './send-logs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendLogsPageRoutingModule
  ],
  declarations: [SendLogsPage]
})
export class SendLogsPageModule {}
