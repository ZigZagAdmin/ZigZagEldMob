import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AUTH_API_URL } from '../app-injection-tokens';
import { Observable } from 'rxjs';
import { DVIRs } from '../models/dvirs';
import { LogDailies } from '../models/log-dailies';
import { LogEvents } from '../models/log-histories';
import { ELD } from '../models/eld';
import { DriverStatus } from '../models/driver-statuses';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, @Inject(AUTH_API_URL) private apiUrl: string) {}

  updateDVIR(dvir: DVIRs): Observable<object> {
    return this.http.post(this.apiUrl + 'eld/EldDashboard/uploadDVIR', dvir);
  }

  updateLogDaily(logDaily: LogDailies): Observable<object> {
    return this.http.post(this.apiUrl + 'eld/eldDashboard/UploadLogDailies', logDaily);
  }

  updateLogEvent(logEvent: LogEvents): Observable<object> {
    return this.http.post(this.apiUrl + 'eld/eldDashboard/UploadLogEvent', logEvent);
  }

  updateELD(eld: ELD) {
    return this.http.post(this.apiUrl + 'eld/eldManage/UploadEld', eld);
  }

  updateDriverStatuses(driverStatus: DriverStatus) {
    return this.http.post(this.apiUrl + 'eld/eldDashboard/UploadDriverStatuses', driverStatus);
  }

}
