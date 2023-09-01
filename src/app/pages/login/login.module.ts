import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
  ],
  declarations: [LoginPage],
  providers: [DatabaseService, Storage],
})
export class LoginPageModule {}
