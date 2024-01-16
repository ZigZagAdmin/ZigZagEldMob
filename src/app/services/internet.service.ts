import { Inject, Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { AUTH_API_URL } from '../app-injection-tokens';

@Injectable({
  providedIn: 'root',
})
export class InternetService {
  internetStatus$ = new BehaviorSubject(false);

  constructor(@Inject(AUTH_API_URL) private apiUrl: string, private storage: Storage, private http: HttpClient) {
    this.checkInternetStatus();
    this.watchInternetStatus();
  }

  private async checkInternetStatus() {
    const status = await Network.getStatus();
    this.internetStatus$.next(status.connected);
    if (status.connected) {
      this.postOfflineData();
    }
  }

  private watchInternetStatus() {
    Network.addListener('networkStatusChange', status => {
      this.internetStatus$.next(status.connected);
      if (status.connected === true) {
        this.postOfflineData();
      }
    });
  }

  async postOfflineData() {
    const LoadingStack: any[] = [];

    await this.storage.get('offlineArray').then(offlineData => {
      if (offlineData)
        offlineData.forEach((el: any) => {
          LoadingStack.push(true);
          this.http.post(this.apiUrl + el.url, el.body).subscribe(
            result => {
              console.log('offlineData sended!');
              const idx = offlineData.findIndex((item: any) => el.url === item.url && JSON.stringify(el.body) === JSON.stringify(item.body));
              offlineData.splice(idx, 1);
              LoadingStack.pop();
              if (LoadingStack.length === 0) {
                this.updateOfflineData(offlineData);
              }
            },
            error => {
              console.log('offlineData not sended :(');
              console.log(error);
              LoadingStack.pop();
              if (LoadingStack.length === 0) {
                this.updateOfflineData(offlineData);
              }
            }
          );
        });
    });
  }

  async updateOfflineData(offlineData: any[]) {
    await this.storage.set('offlineArray', offlineData);
  }
}
