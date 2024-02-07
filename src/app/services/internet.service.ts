import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject, firstValueFrom, forkJoin } from 'rxjs';
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
  internetStatus$ = new BehaviorSubject(false);

  constructor(private storage: Storage, private dashboardService: DashboardService) {
    this.watchInternetStatus();
  }

  private watchInternetStatus() {
    Network.addListener('networkStatusChange', status => {
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
            dvir.sent = true;
            await firstValueFrom(this.dashboardService.updateDVIR(dvir)).then(async (res: any) => {
              if (res.signatureLink && res.signatureLink.length !== 0) {
                dvir.signatureLink = res.signatureLink;
                if (res.mechanicSignatureLink && res.mechanicSignatureLink.length !== 0) {
                  dvir.mechanicSignatureLink = res.mechanicSignatureLink;
                }
                console.error(res);
                await this.storage.set('dvirs', dvirs);
              }
            });
          }
        });
      if (logDailies && logDailies.length !== 0)
        logDailies.forEach(async (logDaily: LogDailies) => {
          if (logDaily?.sent === false) {
            logDaily.sent = true;
            await firstValueFrom(this.dashboardService.updateLogDaily(logDaily));
          }
        });
      await this.storage.set('logDailies', logDailies);
      if (logEvents && logEvents.length !== 0)
        logEvents.forEach(async (logEvent: LogEvents) => {
          if (logEvent?.sent === false) {
            logEvent.sent = true;
            await firstValueFrom(this.dashboardService.updateLogEvent(logEvent));
          }
        });
      await this.storage.set('logEvents', logEvents);
      if (elds && elds.length !== 0)
        elds.forEach(async (eld: ELD) => {
          if (eld?.sent === false) {
            eld.sent = true;
            await firstValueFrom(this.dashboardService.updateELD(eld));
          }
        });
      await this.storage.set('elds', elds);
    });
  }
}
