import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsertDutyStatusPageRoutingModule } from './insert-duty-status-routing.module';

import { InsertDutyStatusPage } from './insert-duty-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsertDutyStatusPageRoutingModule
  ],
  declarations: [InsertDutyStatusPage]
})
export class InsertDutyStatusPageModule {}
