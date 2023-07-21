import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InspectionPreviewPageRoutingModule } from './inspection-preview-routing.module';

import { InspectionPreviewPage } from './inspection-preview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InspectionPreviewPageRoutingModule
  ],
  declarations: [InspectionPreviewPage]
})
export class InspectionPreviewPageModule {}
