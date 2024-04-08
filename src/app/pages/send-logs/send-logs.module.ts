import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendLogsPageRoutingModule } from './send-logs-routing.module';

import { SendLogsPage } from './send-logs.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';

import { InputComponentModule } from 'src/app/components/input/input.module';
import { TextareaComponentModule } from 'src/app/components/textarea/textarea.module';
import { TranslateModule } from '@ngx-translate/core';
import { SelectComponentModule } from 'src/app/components/select/select.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendLogsPageRoutingModule,
    HeaderComponentModule,
    InputComponentModule,
    TextareaComponentModule,
    TranslateModule,
    SelectComponentModule
  ],
  declarations: [SendLogsPage]
})
export class SendLogsPageModule {}
