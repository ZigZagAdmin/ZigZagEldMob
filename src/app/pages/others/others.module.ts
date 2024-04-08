import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OthersPageRoutingModule } from './others-routing.module';

import { OthersPage } from './others.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, OthersPageRoutingModule, HeaderComponentModule, TranslateModule],
  declarations: [OthersPage],
})
export class OthersPageModule {}
