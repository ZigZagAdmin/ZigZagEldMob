import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UnitabPageRoutingModule } from './unitab-routing.module';
import { UnitabPage } from './unitab.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, UnitabPageRoutingModule],
  declarations: [UnitabPage],
})
export class UnitabPageModule {}
