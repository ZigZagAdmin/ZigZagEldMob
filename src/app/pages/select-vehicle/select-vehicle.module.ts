import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectVehiclePageRoutingModule } from './select-vehicle-routing.module';

import { SelectVehiclePage } from './select-vehicle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectVehiclePageRoutingModule
  ],
  declarations: [SelectVehiclePage]
})
export class SelectVehiclePageModule {}
