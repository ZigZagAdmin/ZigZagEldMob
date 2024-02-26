import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatusRadioButtonComponent } from './status-radio-button.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, TranslateModule],
  declarations: [StatusRadioButtonComponent],
  exports: [StatusRadioButtonComponent]
})
export class StatusRadioButtonComponentModule {}
