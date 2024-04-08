import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { IonicModule } from '@ionic/angular';
import { SelectVehiclePageRoutingModule } from './select-vehicle-routing.module';
import { SelectVehiclePage } from './select-vehicle.page';
import { DatabaseService } from 'src/app/services/database.service';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { PageLoaderComponentModule } from 'src/app/components/page-loader/page-loader.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectVehiclePageRoutingModule,
    HeaderComponentModule,
    PageLoaderComponentModule,
    TranslateModule
  ],
  declarations: [SelectVehiclePage],
  providers: [Storage, DatabaseService],
})
export class SelectVehiclePageModule {}
