import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { IonicModule } from '@ionic/angular';
import { SelectVehiclePageRoutingModule } from './select-vehicle-routing.module';
import { SelectVehiclePage } from './select-vehicle.page';
import { DatabaseService } from 'src/app/services/database.service';
import { CardComponent } from './card/card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectVehiclePageRoutingModule,
  ],
  declarations: [SelectVehiclePage, CardComponent],
  providers: [Storage, DatabaseService],
})
export class SelectVehiclePageModule {}
