import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageLoaderComponent } from './page-loader.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [PageLoaderComponent],
  exports: [PageLoaderComponent],
})
export class PageLoaderComponentModule {}
