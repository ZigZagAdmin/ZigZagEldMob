import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AUTH_API_URL } from '../app-injection-tokens';
import { Observable } from 'rxjs';
import { Company } from '../models/company';
import { Terminal } from '../models/terminal';
import { ELD } from '../models/eld';
import { LogHistories } from '../models/log-histories';
import { Driver } from '../models/driver';
import { LogDailies } from '../models/log-dailies';
import { Vehicle } from '../models/vehicle';

@Injectable({
  providedIn: 'root',
})
export class ManageService {
  constructor(
    private http: HttpClient,
    @Inject(AUTH_API_URL) private apiUrl: string
  ) {}

  getDrivers(): Observable<Driver[]> {
    const httpParams = new HttpParams();
    return this.http.get<Driver[]>(this.apiUrl + 'api/EldManage/drivers', {
      params: httpParams,
    });
  }

  getCompany(): Observable<Company> {
    const httpParams = new HttpParams();
    return this.http.get<Company>(this.apiUrl + 'api/EldManage/company', {
      params: httpParams,
    });
  }

  getVehicles(): Observable<Vehicle[]> {
    const httpParams = new HttpParams();
    return this.http.get<Vehicle[]>(this.apiUrl + 'api/EldManage/vehicles', {
      params: httpParams,
    });
  }

  getTerminals(): Observable<Terminal[]> {
    const httpParams = new HttpParams();
    return this.http.get<Terminal[]>(this.apiUrl + 'api/EldManage/terminals', {
      params: httpParams,
    });
  }

  getELDs(): Observable<ELD[]> {
    const httpParams = new HttpParams();
    return this.http.get<ELD[]>(this.apiUrl + 'api/EldManage/elds', {
      params: httpParams,
    });
  }

  getLogDailies(
    GeneralId: string,
    DateLog: string,
    CountDay: number
  ): Observable<LogDailies[]> {
    const httpParams = new HttpParams()
      .set('GeneralId', GeneralId)
      .set('LogDate', DateLog)
      .set('CountDay', CountDay.toString());
    return this.http.get<LogDailies[]>(
      this.apiUrl + 'api/EldDashboard/LogDailies',
      { params: httpParams }
    );
  }

  getLogHistories14Days(DriverId: string): Observable<LogHistories[]> {
    const httpParams = new HttpParams().set('DriverId', DriverId);
    return this.http.get<LogHistories[]>(
      this.apiUrl + 'api/EldDashboard/LogHistories14days',
      { params: httpParams }
    );
  }
}
