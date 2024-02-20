import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DvirPageRoutingModule } from './dvir-routing.module';
import { DvirPage } from './dvir.page';
import { OrdinalPipe } from 'src/app/pipe/ordinal.pipe';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { PageLoaderComponentModule } from 'src/app/components/page-loader/page-loader.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DvirPageRoutingModule, HeaderComponentModule, PageLoaderComponentModule],
  declarations: [DvirPage, OrdinalPipe],
})
export class DvirPageModule {}
