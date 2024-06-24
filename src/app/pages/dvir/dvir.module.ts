import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DvirPageRoutingModule } from './dvir-routing.module';
import { DvirPage } from './dvir.page';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { PageLoaderComponentModule } from 'src/app/components/page-loader/page-loader.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipe/pipes.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DvirPageRoutingModule, HeaderComponentModule, PageLoaderComponentModule, TranslateModule, PipesModule],
  declarations: [DvirPage],
})
export class DvirPageModule {}
