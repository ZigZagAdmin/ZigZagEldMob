import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConnectMacPageRoutingModule } from './connect-mac-routing.module';
import { ConnectMacPage } from './connect-mac.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectMacPageRoutingModule,
  ],
  providers: [],
  declarations: [ConnectMacPage],
})
export class ConnectMacPageModule {}
