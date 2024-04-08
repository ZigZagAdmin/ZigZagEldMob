import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformationPageRoutingModule } from './information-routing.module';

import { InformationPage } from './information.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, InformationPageRoutingModule, HeaderComponentModule, TranslateModule],
  declarations: [InformationPage],
})
export class InformationPageModule {}
