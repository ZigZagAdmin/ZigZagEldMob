import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ConverStringDateToMilisecondsPipe } from './conver-string-date-to-miliseconds.pipe';
import { ConvertMilisecondsToHoursAndMinutesPipe } from './convert-miliseconds-to-hours-and-minutes.pipe';
import { ConvertMsToHoursAndMinutesAndSecondsHmPipe } from './convert-ms-to-hours-and-minutes-and-seconds-hm.pipe';
import { ConvertSecondsToHoursAndMinutesHmPipe } from './convert-seconds-to-hours-and-minutes-hm.pipe';
import { ConvertSecondsToHoursAndMinutesPipe } from './convert-seconds-to-hours-and-minutes.pipe';
import { MilisecToHoursAndMinutesPipe } from './milisec-to-hours-and-minutes.pipe';
import { OrdinalPipe } from './ordinal.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [ConverStringDateToMilisecondsPipe, ConvertMilisecondsToHoursAndMinutesPipe, ConvertMsToHoursAndMinutesAndSecondsHmPipe, ConvertSecondsToHoursAndMinutesHmPipe, ConvertSecondsToHoursAndMinutesPipe, MilisecToHoursAndMinutesPipe, OrdinalPipe],
  exports: [ConverStringDateToMilisecondsPipe, ConvertMilisecondsToHoursAndMinutesPipe, ConvertMsToHoursAndMinutesAndSecondsHmPipe, ConvertSecondsToHoursAndMinutesHmPipe, ConvertSecondsToHoursAndMinutesPipe, MilisecToHoursAndMinutesPipe, OrdinalPipe]
})
export class PipesModule {}
