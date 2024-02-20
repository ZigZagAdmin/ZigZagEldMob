import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationInputComponent } from './location-input.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [LocationInputComponent],
  exports: [LocationInputComponent],
})
export class LocationInputComponentModule {}
