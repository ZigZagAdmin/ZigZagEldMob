import { Inject, Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject, forkJoin, switchMap } from 'rxjs';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { AUTH_API_URL } from '../app-injection-tokens';
import { ManageService } from './manage.service';
import { DVIRs } from '../models/dvirs';
import { LogDailies } from '../models/log-dailies';
import { LogEvents } from '../models/log-histories';
import { ELD } from '../models/eld';
import { DashboardService } from './dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class InternetService {
  internetStatus$ = new BehaviorSubject(false);

  constructor(private storage: Storage, private dashboardService: DashboardService) {
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
    let dvirs$ = this.storage.get('dvirs');
    let logDailies$ = this.storage.get('logDailies');
    let logEvents$ = this.storage.get('logEvents');
    let elds$ = this.storage.get('elds');

    forkJoin([dvirs$, logDailies$, logEvents$, elds$]).subscribe(([dvirs, logDailies, logEvents, elds]) => {
      if (dvirs && dvirs.length !== 0) dvirs.forEach((dvir: DVIRs) => !dvir.sent ? this.dashboardService.updateDVIR(dvir) : '');
      if (logDailies && logDailies.length !== 0) logDailies.forEach((logDaily: LogDailies) => !logDaily.sent ? this.dashboardService.updateLogDaily(logDaily) : '');
      if (logEvents && logEvents.length !== 0) logEvents.forEach((logEvent: LogEvents) => !logEvent.sent ? this.dashboardService.updateLogEvent(logEvent) : '');
      if (elds && elds.length !== 0) elds.forEach((eld: ELD) => !eld.sent ? this.dashboardService.updateELD(eld) : '');
    });
  }
}
