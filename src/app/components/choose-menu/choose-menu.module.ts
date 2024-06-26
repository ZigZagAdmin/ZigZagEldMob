import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { ChooseMenuComponent } from './choose-menu.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
  declarations: [ChooseMenuComponent],
  exports: [ChooseMenuComponent],
})
export class ChooseMenuComponentModule {}
