import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';

import { AccountPage } from './account.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { InputComponentModule } from 'src/app/components/input/input.module';
import { SelectComponentModule } from 'src/app/components/select/select.module';
import { PageLoaderComponentModule } from 'src/app/components/page-loader/page-loader.module';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleSwitchComponentModule } from 'src/app/components/toggle-switch/toggle-switch.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule,
    HeaderComponentModule,
    InputComponentModule,
    SelectComponentModule,
    PageLoaderComponentModule,
    TranslateModule,
    ToggleSwitchComponentModule,
  ],
  declarations: [AccountPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountPageModule {}
