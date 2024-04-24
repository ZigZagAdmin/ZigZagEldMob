import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConnectMacPageRoutingModule } from './connect-mac-routing.module';
import { ConnectMacPage } from './connect-mac.page';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { InputComponentModule } from 'src/app/components/input/input.module';
import { DateTimeComponentModule } from 'src/app/components/date-time/date-time.module';
import { TranslateModule } from '@ngx-translate/core';
import { ChooseMenuComponentModule } from 'src/app/components/choose-menu/choose-menu.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ConnectMacPageRoutingModule, HeaderComponentModule, InputComponentModule, DateTimeComponentModule, TranslateModule, ChooseMenuComponentModule],
  providers: [],
  declarations: [ConnectMacPage],
})
export class ConnectMacPageModule {}
