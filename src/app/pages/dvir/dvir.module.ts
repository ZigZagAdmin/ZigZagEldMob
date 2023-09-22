import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DvirPageRoutingModule } from './dvir-routing.module';
import { DvirPage } from './dvir.page';
import { CardComponent } from './card/card.component';
import { OrdinalPipe } from 'src/app/pipe/ordinal.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DvirPageRoutingModule],
  declarations: [DvirPage, CardComponent, OrdinalPipe]
})
export class DvirPageModule {}
