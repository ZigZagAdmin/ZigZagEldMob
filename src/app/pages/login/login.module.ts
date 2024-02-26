import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { InputComponentModule } from 'src/app/components/input/input.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    InputComponentModule,
    TranslateModule
  ],
  declarations: [LoginPage],
  providers: [DatabaseService, Storage],
})
export class LoginPageModule {}
