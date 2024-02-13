import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InspectionPreviewPageRoutingModule } from './inspection-preview-routing.module';

import { InspectionPreviewPage } from './inspection-preview.page';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { ScrollToolbarComponentModule } from 'src/app/components/scroll-toolbar/scroll-toolbar.module';
import { HosPageModule } from '../hos/hos.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, InspectionPreviewPageRoutingModule, HeaderComponentModule, ScrollToolbarComponentModule, HosPageModule],
  declarations: [InspectionPreviewPage],
})
export class InspectionPreviewPageModule {}
