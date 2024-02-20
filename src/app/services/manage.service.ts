import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AUTH_API_URL } from '../app-injection-tokens';
import { Observable } from 'rxjs';
import { Company } from '../models/company';
import { Terminal } from '../models/terminal';
import { ELD } from '../models/eld';
import { LogEvents } from '../models/log-histories';
import { Driver } from '../models/driver';
import { LogDailies } from '../models/log-dailies';
import { Vehicle } from '../models/vehicle';
import { DVIRs } from '../models/dvirs';
import { PlacesCity } from '../models/places-city';

@Injectable({
  providedIn: 'root',
})
export class ManageService {
  constructor(private http: HttpClient, @Inject(AUTH_API_URL) private apiUrl: string) {}

  getDrivers(driverId: string): Observable<Driver[]> {
    const httpParams = new HttpParams().set('driverId', driverId);
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

  // getVehicles(): Observable<Vehicle[]> {
  //   const httpParams = new HttpParams();
  //   return this.http.get<Vehicle[]>(this.apiUrl + 'api/EldManage/vehicles', {
  //     params: httpParams,
  //   });
  // }

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

  getDVIRs(): Observable<DVIRs[]> {
    const httpParams = new HttpParams();
    return this.http.get<DVIRs[]>(this.apiUrl + 'api/EldDashboard/DVIRs', {
      params: httpParams,
    });
  }

  getPlacesCity(): Observable<PlacesCity[]> {
    const httpParams = new HttpParams();
    return this.http.get<PlacesCity[]>(this.apiUrl + 'api/EldDirectory/PlacesCity', {
      params: httpParams,
    });
  }

  getLogDailies(GeneralId: string, DateLog: string, CountDay: number): Observable<LogDailies[]> {
    const httpParams = new HttpParams().set('GeneralId', GeneralId).set('LogDate', DateLog).set('CountDay', CountDay.toString());
    return this.http.get<LogDailies[]>(this.apiUrl + 'api/EldDashboard/LogDailies', { params: httpParams });
  }

  getLogEvents(DriverId?: string, LogDateBgn?: string, LogDateEnd?: string): Observable<LogEvents[]> {
    // const httpParams = new HttpParams().set('DriverId', DriverId).set('LogDateBgn', LogDateBgn).set('LogDateEnd', LogDateEnd);
    return this.http.get<LogEvents[]>(this.apiUrl + 'api/EldDashboard/LogEvents');
  }
}
