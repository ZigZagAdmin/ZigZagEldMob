import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectComponent } from './select.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [SelectComponent],
  exports: [SelectComponent],
})
export class SelectComponentModule {}
