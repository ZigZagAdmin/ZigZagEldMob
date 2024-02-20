import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DateTimeComponent } from './date-time.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [DateTimeComponent],
  exports: [DateTimeComponent]
})
export class DateTimeComponentModule {}
