import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CurrentStatusComponent } from './current-status.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, TranslateModule],
  declarations: [CurrentStatusComponent],
  exports: [CurrentStatusComponent]
})
export class CurrentStatusComponentModule {}
