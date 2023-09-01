import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDutyStatusPageRoutingModule } from './edit-duty-status-routing.module';

import { EditDutyStatusPage } from './edit-duty-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDutyStatusPageRoutingModule
  ],
  declarations: [EditDutyStatusPage]
})
export class EditDutyStatusPageModule {}
