import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsertDutyStatusPageRoutingModule } from './insert-duty-status-routing.module';

import { InsertDutyStatusPage } from './insert-duty-status.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';

import { InputComponentModule } from 'src/app/components/input/input.module';

import { TextareaComponentModule } from 'src/app/components/textarea/textarea.module';

import { DutyRadioButtonComponentModule } from 'src/app/components/duty-radio-button/duty-radio-button.module';
import { PageLoaderComponentModule } from 'src/app/components/page-loader/page-loader.module';
import { HosPageModule } from '../hos/hos.module';
import { DateTimeComponentModule } from 'src/app/components/date-time/date-time.module';
import { CommentsComponentModule } from 'src/app/components/comments/comments.module';
import { LocationInputComponentModule } from 'src/app/components/location-input/location-input.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsertDutyStatusPageRoutingModule,
    HeaderComponentModule,
    InputComponentModule,
    TextareaComponentModule,
    DutyRadioButtonComponentModule,
    PageLoaderComponentModule,
    HosPageModule,
    DateTimeComponentModule,
    CommentsComponentModule,
    LocationInputComponentModule,
    TranslateModule
  ],
  declarations: [InsertDutyStatusPage]
})
export class InsertDutyStatusPageModule {}
