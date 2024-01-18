import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogItemPageRoutingModule } from './log-item-routing.module';
import { ConverStringDateToMilisecondsPipe } from 'src/app/pipe/conver-string-date-to-miliseconds.pipe';
import { ConvertMilisecondsToHoursAndMinutesPipe } from 'src/app/pipe/convert-miliseconds-to-hours-and-minutes.pipe';
import { LogItemPage } from './log-item.page';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { ScrollToolbarComponentModule } from 'src/app/components/scroll-toolbar/scroll-toolbar.module';
import { InputComponentModule } from 'src/app/components/input/input.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, LogItemPageRoutingModule, ReactiveFormsModule, HeaderComponentModule, ScrollToolbarComponentModule, InputComponentModule],
  declarations: [LogItemPage, ConverStringDateToMilisecondsPipe, ConvertMilisecondsToHoursAndMinutesPipe],
})
export class LogItemPageModule {}
