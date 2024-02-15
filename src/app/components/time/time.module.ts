import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeComponent } from './time.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [TimeComponent],
  exports: [TimeComponent]
})
export class TimeComponentModule {}
