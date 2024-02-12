import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject, Observable, firstValueFrom, forkJoin } from 'rxjs';
import { Storage } from '@ionic/storage';
import { DVIRs } from '../models/dvirs';
import { LogDailies } from '../models/log-dailies';
import { LogEvents } from '../models/log-histories';
import { ELD } from '../models/eld';
import { DashboardService } from './dashboard.service';
import { ManageService } from './manage.service';
import { formatDate } from '@angular/common';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class InternetService {
  internetStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  interetStatusObs: Observable<boolean> = this.internetStatus$.asObservable();

  constructor(private storage: Storage, private dashboardService: DashboardService) {
    this.watchInternetStatus();
    Network.getStatus().then(value => {
      this.internetStatus$.next(value.connected);
      console.log('internet service constructor');
    });
  }

  private watchInternetStatus() {
    Network.addListener('networkStatusChange', status => {
      console.log('Network Status:', status);
      this.internetStatus$.next(status.connected);
    });
  }

  async postOfflineData() {
    let dvirs$ = this.storage.get('dvirs');
    let logDailies$ = this.storage.get('logDailies');
    let logEvents$ = this.storage.get('logEvents');
    let elds$ = this.storage.get('elds');

    forkJoin([dvirs$, logDailies$, logEvents$, elds$]).subscribe(async ([dvirs, logDailies, logEvents, elds]) => {
      if (dvirs && dvirs.length !== 0)
        dvirs.forEach(async (dvir: DVIRs) => {
          if (dvir?.sent === false) {
            await firstValueFrom(this.dashboardService.updateDVIR(dvir)).then(async (res: any) => {
              dvir.sent = true;
              if (res.signatureLink && res.signatureLink.length !== 0) {
                dvir.signatureLink = res.signatureLink;
                if (res.mechanicSignatureLink && res.mechanicSignatureLink.length !== 0) {
                  dvir.mechanicSignatureLink = res.mechanicSignatureLink;
                }
                console.error(res);
              }
              await this.storage.set('dvirs', dvirs);
            });
          }
        });
      if (logDailies && logDailies.length !== 0)
        logDailies.forEach(async (logDaily: LogDailies) => {
          if (logDaily?.sent === false) {
            await firstValueFrom(this.dashboardService.updateLogDaily(logDaily)).then(async (res: any) => {
              logDaily.sent = true;
              console.error(res);
              if (res.signatureLink && res.signatureLink.length !== 0) {
                logDaily.form.signatureLink = res.signatureLink;
                console.error(res.signatureLink);
              }
              await this.storage.set('logDailies', logDailies);
            });
          }
        });
      if (logEvents && logEvents.length !== 0)
        logEvents.forEach(async (logEvent: LogEvents) => {
          if (logEvent?.sent === false) {
            console.error(logEvent);
            await firstValueFrom(this.dashboardService.updateLogEvent(logEvent)).then(async () => {
              logEvent.sent = true;
              await this.storage.set('logEvents', logEvents);
            });
          }
        });
      if (elds && elds.length !== 0)
        elds.forEach(async (eld: ELD) => {
          if (eld?.sent === false) {
            await firstValueFrom(this.dashboardService.updateELD(eld)).then(async () => {
              eld.sent = true;
              await this.storage.set('elds', elds);
            });
          }
        });
    });
  }
}
