import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConnectMacPageRoutingModule } from './connect-mac-routing.module';
import { ConnectMacPage } from './connect-mac.page';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { InputComponentModule } from 'src/app/components/input/input.module';
import { MultipleSelectComponentModule } from 'src/app/components/multiple-select/multiple-select.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ConnectMacPageRoutingModule, HeaderComponentModule, InputComponentModule, MultipleSelectComponentModule],
  providers: [],
  declarations: [ConnectMacPage],
})
export class ConnectMacPageModule {}
