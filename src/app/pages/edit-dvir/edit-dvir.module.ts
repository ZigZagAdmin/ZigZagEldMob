import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDvirPageRoutingModule } from './edit-dvir-routing.module';

import { EditDvirPage } from './edit-dvir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDvirPageRoutingModule
  ],
  declarations: [EditDvirPage]
})
export class EditDvirPageModule {}
