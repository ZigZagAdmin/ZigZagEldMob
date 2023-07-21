import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DvirPageRoutingModule } from './dvir-routing.module';

import { DvirPage } from './dvir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DvirPageRoutingModule
  ],
  declarations: [DvirPage]
})
export class DvirPageModule {}
