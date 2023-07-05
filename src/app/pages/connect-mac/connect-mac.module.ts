import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConnectMacPageRoutingModule } from './connect-mac-routing.module';
import { ConnectMacPage } from './connect-mac.page';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectMacPageRoutingModule,
  ],
  providers: [BluetoothLE],
  declarations: [ConnectMacPage],
})
export class ConnectMacPageModule {}
