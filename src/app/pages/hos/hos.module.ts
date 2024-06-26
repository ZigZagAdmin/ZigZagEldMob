import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { IonicModule } from '@ionic/angular';
import { HosPageRoutingModule } from './hos-routing.module';
import { HosPage } from './hos.page';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { ToggleSwitchComponentModule } from 'src/app/components/toggle-switch/toggle-switch.module';
import { InputComponentModule } from 'src/app/components/input/input.module';
import { TextareaComponentModule } from 'src/app/components/textarea/textarea.module';
import { DutyRadioButtonComponentModule } from 'src/app/components/duty-radio-button/duty-radio-button.module';
import { LocationInputComponentModule } from 'src/app/components/location-input/location-input.module';
import { MessageBannerComponentModule } from 'src/app/components/message-banner/message-banner.module';
import { CommentsComponentModule } from 'src/app/components/comments/comments.module';
import { PageLoaderComponentModule } from 'src/app/components/page-loader/page-loader.module';
import { TranslateModule } from '@ngx-translate/core';
import { CurrentStatusComponentModule } from 'src/app/components/current-status/current-status.module';
import { ChangeStatusComponentModule } from 'src/app/components/change-status/current-status.module';
import { HoursRemainingComponentModule } from 'src/app/components/hours-remaining/hours-remaining.module';
import { RecapComponent } from './recap/recap.component';
import { PipesModule } from 'src/app/pipe/pipes.module';
import { LogDailyComponent } from './log-daily/log-daily.component';
import { SelectComponentModule } from 'src/app/components/select/select.module';
import { CommentsModalComponent } from './comments-modal/comments-modal.component';

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
    TranslateModule,
    CurrentStatusComponentModule,
    ChangeStatusComponentModule,
    HoursRemainingComponentModule,
    PipesModule,
    SelectComponentModule
  ],
  declarations: [HosPage, RecapComponent, LogDailyComponent, CommentsModalComponent],
})
export class HosPageModule {}
