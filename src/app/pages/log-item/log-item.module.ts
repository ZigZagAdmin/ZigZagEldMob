import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogItemPageRoutingModule } from './log-item-routing.module';
import { ConverStringDateToMilisecondsPipe } from 'src/app/pipe/conver-string-date-to-miliseconds.pipe';
import { ConvertMilisecondsToHoursAndMinutesPipe } from 'src/app/pipe/convert-miliseconds-to-hours-and-minutes.pipe';
import { LogItemPage } from './log-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogItemPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    LogItemPage,
    ConverStringDateToMilisecondsPipe,
    ConvertMilisecondsToHoursAndMinutesPipe,
  ],
})
export class LogItemPageModule {}
