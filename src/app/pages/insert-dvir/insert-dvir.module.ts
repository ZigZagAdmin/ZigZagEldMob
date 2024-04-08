import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InsertDvirPageRoutingModule } from './insert-dvir-routing.module';

import { InsertDvirPage } from './insert-dvir.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { StatusRadioButtonComponentModule } from 'src/app/components/status-radio-button/status-radio-button.module';
import { InputComponentModule } from 'src/app/components/input/input.module';
import { SelectComponentModule } from 'src/app/components/select/select.module';
import { TextareaComponentModule } from 'src/app/components/textarea/textarea.module';

import { MultipleSelectComponentModule } from 'src/app/components/multiple-select/multiple-select.module';

import { LocationInputComponentModule } from 'src/app/components/location-input/location-input.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InsertDvirPageRoutingModule,
    HeaderComponentModule,
    StatusRadioButtonComponentModule,
    InputComponentModule,
    SelectComponentModule,
    TextareaComponentModule,
    MultipleSelectComponentModule,
    LocationInputComponentModule,
    TranslateModule
  ],
  declarations: [InsertDvirPage],
})
export class InsertDvirPageModule {}
