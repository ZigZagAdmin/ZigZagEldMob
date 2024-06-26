import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavParams } from '@ionic/angular';

import { IonicModule } from '@ionic/angular';

import { EditDvirPageRoutingModule } from './edit-dvir-routing.module';

import { EditDvirPage } from './edit-dvir.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';

import { InputComponentModule } from 'src/app/components/input/input.module';
import { SelectComponentModule } from 'src/app/components/select/select.module';
import { TextareaComponentModule } from 'src/app/components/textarea/textarea.module';
import { StatusRadioButtonComponentModule } from 'src/app/components/status-radio-button/status-radio-button.module';
import { MultipleSelectComponentModule } from 'src/app/components/multiple-select/multiple-select.module';
import { LocationInputComponentModule } from 'src/app/components/location-input/location-input.module';
import { TranslateModule } from '@ngx-translate/core';
import { PageLoaderComponentModule } from 'src/app/components/page-loader/page-loader.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDvirPageRoutingModule,
    ReactiveFormsModule,
    HeaderComponentModule,
    InputComponentModule,
    SelectComponentModule,
    TextareaComponentModule,
    StatusRadioButtonComponentModule,
    MultipleSelectComponentModule,
    LocationInputComponentModule,
    TranslateModule,
    PageLoaderComponentModule,
  ],
  declarations: [EditDvirPage],
  providers: [NavParams],
})
export class EditDvirPageModule {}
