import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatusRadioButtonComponent } from './status-radio-button.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [StatusRadioButtonComponent],
  exports: [StatusRadioButtonComponent]
})
export class StatusRadioButtonComponentModule {}
