import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentsComponent } from './comments.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, TranslateModule],
  declarations: [CommentsComponent],
  exports: [CommentsComponent]
})
export class CommentsComponentModule {}
