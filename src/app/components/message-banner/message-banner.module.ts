import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessageBannerComponent } from './message-banner.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [MessageBannerComponent],
  exports: [MessageBannerComponent],
})
export class MessageBannerComponentModule {}
