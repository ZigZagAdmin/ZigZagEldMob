import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ToggleSwitchComponent } from './toggle-switch.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [ToggleSwitchComponent],
  exports: [ToggleSwitchComponent],
})
export class ToggleSwitchComponentModule {}
