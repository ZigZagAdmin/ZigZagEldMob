import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserManualPageRoutingModule } from './user-manual-routing.module';

import { UserManualPage } from './user-manual.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, UserManualPageRoutingModule, HeaderComponentModule, PdfViewerModule, PinchZoomModule],
  declarations: [UserManualPage],
})
export class UserManualPageModule {}
