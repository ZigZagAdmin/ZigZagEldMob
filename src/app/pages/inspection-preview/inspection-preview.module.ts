import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InspectionPreviewPageRoutingModule } from './inspection-preview-routing.module';

import { InspectionPreviewPage } from './inspection-preview.page';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { ScrollToolbarComponentModule } from 'src/app/components/scroll-toolbar/scroll-toolbar.module';
import { HosPageModule } from '../hos/hos.module';
import { TranslateModule } from '@ngx-translate/core';
import { PageLoaderComponentModule } from 'src/app/components/page-loader/page-loader.module';
import { PipesModule } from 'src/app/pipe/pipes.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, InspectionPreviewPageRoutingModule, HeaderComponentModule, ScrollToolbarComponentModule, HosPageModule, TranslateModule, PageLoaderComponentModule, PipesModule],
  declarations: [InspectionPreviewPage],
})
export class InspectionPreviewPageModule {}
