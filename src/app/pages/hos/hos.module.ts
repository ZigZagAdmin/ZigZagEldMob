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
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HosPageRoutingModule, NgCircleProgressModule.forRoot(), HeaderComponentModule],
  declarations: [HosPage, MilisecToHoursAndMinutesPipe, ConvertSecondsToHoursAndMinutesPipe],
})
export class HosPageModule {}
