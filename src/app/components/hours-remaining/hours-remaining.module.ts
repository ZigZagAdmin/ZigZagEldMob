import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HoursRemainingComponent } from './hours-remaining.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, NgCircleProgressModule.forRoot(), TranslateModule],
  declarations: [HoursRemainingComponent],
  exports: [HoursRemainingComponent]
})
export class HoursRemainingComponentModule {}
