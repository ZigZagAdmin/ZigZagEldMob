import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDutyStatusPageRoutingModule } from './edit-duty-status-routing.module';

import { EditDutyStatusPage } from './edit-duty-status.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';

import { InputComponentModule } from 'src/app/components/input/input.module';

import { TextareaComponentModule } from 'src/app/components/textarea/textarea.module';

import { DutyRadioButtonComponentModule } from 'src/app/components/duty-radio-button/duty-radio-button.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, EditDutyStatusPageRoutingModule, HeaderComponentModule, InputComponentModule, TextareaComponentModule, DutyRadioButtonComponentModule],
  declarations: [EditDutyStatusPage],
})
export class EditDutyStatusPageModule {}
