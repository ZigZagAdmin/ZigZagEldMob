import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DutyRadioButtonComponent } from './duty-radio-button.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, TranslateModule],
  declarations: [DutyRadioButtonComponent],
  exports: [DutyRadioButtonComponent]
})
export class DutyRadioButtonComponentModule {}
