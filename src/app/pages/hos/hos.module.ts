import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HosPageRoutingModule } from './hos-routing.module';

import { HosPage } from './hos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HosPageRoutingModule
  ],
  declarations: [HosPage]
})
export class HosPageModule {}
