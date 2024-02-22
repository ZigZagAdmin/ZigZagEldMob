import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoDriverPageRoutingModule } from './co-driver-routing.module';

import { CoDriverPage } from './co-driver.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';

import { SelectComponentModule } from 'src/app/components/select/select.module';

import { PageLoaderComponentModule } from 'src/app/components/page-loader/page-loader.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoDriverPageRoutingModule,
    HeaderComponentModule,
    SelectComponentModule,
    PageLoaderComponentModule
  ],
  declarations: [CoDriverPage]
})
export class CoDriverPageModule {}
