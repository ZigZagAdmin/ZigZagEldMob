import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogItemPageRoutingModule } from './log-item-routing.module';

import { LogItemPage } from './log-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogItemPageRoutingModule
  ],
  declarations: [LogItemPage]
})
export class LogItemPageModule {}
