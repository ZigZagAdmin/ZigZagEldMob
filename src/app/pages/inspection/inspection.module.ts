import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InspectionPageRoutingModule } from './inspection-routing.module';

import { InspectionPage } from './inspection.page';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, InspectionPageRoutingModule, HeaderComponentModule, TranslateModule],
  declarations: [InspectionPage],
})
export class InspectionPageModule {}
