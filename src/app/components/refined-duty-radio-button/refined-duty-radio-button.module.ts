import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefinedDutyRadioButtonComponent } from './refined-duty-radio-button.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, TranslateModule],
  declarations: [RefinedDutyRadioButtonComponent],
  exports: [RefinedDutyRadioButtonComponent]
})
export class RefinedDutyRadioButtonComponentModule {}
