import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LockScreenComponent } from './lock-screen.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipe/pipes.module';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, TranslateModule, PipesModule],
  declarations: [LockScreenComponent],
  exports: [LockScreenComponent]
})
export class LockScreenComponentModule {}
