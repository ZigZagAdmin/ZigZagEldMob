import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstructionsPageRoutingModule } from './instructions-routing.module';

import { InstructionsPage } from './instructions.page';
import { HeaderComponentModule } from 'src/app/components/header/header.module';

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InstructionsPageRoutingModule,
    HeaderComponentModule,
    PdfViewerModule,
    PinchZoomModule,
    TranslateModule
  ],
  declarations: [InstructionsPage]
})
export class InstructionsPageModule {}
