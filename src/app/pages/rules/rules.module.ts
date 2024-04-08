import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RulesPageRoutingModule } from './rules-routing.module';

import { RulesPage } from './rules.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { PageLoaderComponentModule } from 'src/app/components/page-loader/page-loader.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RulesPageRoutingModule, HeaderComponentModule, TranslateModule, PageLoaderComponentModule],
  declarations: [RulesPage],
})
export class RulesPageModule {}
