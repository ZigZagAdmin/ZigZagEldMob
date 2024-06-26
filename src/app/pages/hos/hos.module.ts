import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { IonicModule } from '@ionic/angular';
import { HosPageRoutingModule } from './hos-routing.module';
import { HosPage } from './hos.page';
import { MilisecToHoursAndMinutesPipe } from 'src/app/pipe/milisec-to-hours-and-minutes.pipe';
import { ConvertSecondsToHoursAndMinutesPipe } from 'src/app/pipe/convert-seconds-to-hours-and-minutes.pipe';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { ToggleSwitchComponentModule } from 'src/app/components/toggle-switch/toggle-switch.module';
import { InputComponentModule } from 'src/app/components/input/input.module';
import { TextareaComponentModule } from 'src/app/components/textarea/textarea.module';
import { DutyRadioButtonComponentModule } from 'src/app/components/duty-radio-button/duty-radio-button.module';
import { LocationInputComponentModule } from 'src/app/components/location-input/location-input.module';
import { MessageBannerComponentModule } from 'src/app/components/message-banner/message-banner.module';
import { ConvertSecondsToHoursAndMinutesHmPipe } from 'src/app/pipe/convert-seconds-to-hours-and-minutes-hm.pipe';
import { CommentsComponentModule } from 'src/app/components/comments/comments.module';
import { PageLoaderComponentModule } from 'src/app/components/page-loader/page-loader.module';
import { ConvertMsToHoursAndMinutesAndSecondsHmPipe } from 'src/app/pipe/convert-ms-to-hours-and-minutes-and-seconds-hm.pipe';
import { TranslateModule } from '@ngx-translate/core';

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
    LocationInputComponentModule,
    MessageBannerComponentModule,
    CommentsComponentModule,
    PageLoaderComponentModule,
    TranslateModule
  ],
  declarations: [HosPage, MilisecToHoursAndMinutesPipe, ConvertSecondsToHoursAndMinutesPipe, ConvertSecondsToHoursAndMinutesHmPipe, ConvertMsToHoursAndMinutesAndSecondsHmPipe],
  exports: [ConvertSecondsToHoursAndMinutesPipe, ConvertSecondsToHoursAndMinutesHmPipe, ConvertMsToHoursAndMinutesAndSecondsHmPipe],
})
export class HosPageModule {}
