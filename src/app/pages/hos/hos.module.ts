import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { IonicModule } from '@ionic/angular';
import { HosPageRoutingModule } from './hos-routing.module';
import { HosPage } from './hos.page';
import { MilisecToHoursAndMinutesPipe } from 'src/app/pipe/milisec-to-hours-and-minutes.pipe';
import { ConvertSecondsToHoursAndMinutesPipe } from 'src/app/pipe/convert-secotds-to-hours-and-minutes.pipe';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { ToggleSwitchComponentModule } from 'src/app/components/toggle-switch/toggle-switch.module';
import { InputComponentModule } from 'src/app/components/input/input.module';
import { TextareaComponentModule } from 'src/app/components/textarea/textarea.module';
import { DutyRadioButtonComponentModule } from 'src/app/components/duty-radio-button/duty-radio-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HosPageRoutingModule,
    NgCircleProgressModule.forRoot(),
    HeaderComponentModule,
    ToggleSwitchComponentModule,
    InputComponentModule,
    TextareaComponentModule,
    DutyRadioButtonComponentModule,
  ],
  declarations: [HosPage, MilisecToHoursAndMinutesPipe, ConvertSecondsToHoursAndMinutesPipe],
})
export class HosPageModule {}
