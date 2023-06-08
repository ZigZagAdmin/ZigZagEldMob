import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
  ],
  declarations: [LoginPage],
  providers: [BluetoothSerial, LocationAccuracy],
})
export class LoginPageModule {}
