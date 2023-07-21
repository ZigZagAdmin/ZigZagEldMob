import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsertDvirPageRoutingModule } from './insert-dvir-routing.module';

import { InsertDvirPage } from './insert-dvir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsertDvirPageRoutingModule
  ],
  declarations: [InsertDvirPage]
})
export class InsertDvirPageModule {}
