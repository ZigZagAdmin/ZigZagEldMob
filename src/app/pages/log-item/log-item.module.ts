import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogItemPageRoutingModule } from './log-item-routing.module';
import { LogItemPage } from './log-item.page';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { ScrollToolbarComponentModule } from 'src/app/components/scroll-toolbar/scroll-toolbar.module';
import { InputComponentModule } from 'src/app/components/input/input.module';
import { LogItemDailyComponent } from './log-item-daily/log-item-daily.component';
import { HosPageModule } from '../hos/hos.module';
import { PageLoaderComponentModule } from 'src/app/components/page-loader/page-loader.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipe/pipes.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogItemPageRoutingModule,
    ReactiveFormsModule,
    HeaderComponentModule,
    ScrollToolbarComponentModule,
    InputComponentModule,
    HosPageModule,
    PageLoaderComponentModule,
    TranslateModule,
    PipesModule
  ],
  declarations: [LogItemPage, LogItemDailyComponent],
})
export class LogItemPageModule {}
