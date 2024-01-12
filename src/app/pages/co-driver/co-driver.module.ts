import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoDriverPageRoutingModule } from './co-driver-routing.module';

import { CoDriverPage } from './co-driver.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoDriverPageRoutingModule,
    HeaderComponentModule
  ],
  declarations: [CoDriverPage]
})
export class CoDriverPageModule {}
