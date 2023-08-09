import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { IonicModule } from '@ionic/angular';
import { HosPageRoutingModule } from './hos-routing.module';
import { HosPage } from './hos.page';
import { MilisecToHoursAndMinutesPipe } from 'src/app/pipe/milisec-to-hours-and-minutes.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HosPageRoutingModule,
    NgCircleProgressModule.forRoot(),
  ],
  declarations: [HosPage, MilisecToHoursAndMinutesPipe],
})
export class HosPageModule {}
