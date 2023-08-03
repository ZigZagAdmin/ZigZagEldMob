import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ACCESS_TOKEN_KEY } from './services/auth.service';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AUTH_API_URL } from './app-injection-tokens';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';

export function tokenGetter(): string {
  return localStorage.getItem(ACCESS_TOKEN_KEY)!;
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: environment.tokenAllowedDomains,
      },
    }),
  ],
  providers: [
    Storage,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    {
      provide: AUTH_API_URL,
      useValue: environment.authApi,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
