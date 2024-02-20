import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';

import { AccountPage } from './account.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { InputComponentModule } from 'src/app/components/input/input.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule,
    HeaderComponentModule,
    InputComponentModule
  ],
  declarations: [AccountPage]
})
export class AccountPageModule {}
