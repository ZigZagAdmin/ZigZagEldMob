import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ScrollToolbarComponent } from './scroll-toolbar.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [ScrollToolbarComponent],
  exports: [ScrollToolbarComponent]
})
export class ScrollToolbarComponentModule {}
