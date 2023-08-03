import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavParams } from '@ionic/angular';

import { IonicModule } from '@ionic/angular';

import { EditDvirPageRoutingModule } from './edit-dvir-routing.module';

import { EditDvirPage } from './edit-dvir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDvirPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [EditDvirPage],
  providers: [NavParams],
})
export class EditDvirPageModule {}
