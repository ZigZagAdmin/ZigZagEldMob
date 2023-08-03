import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AUTH_API_URL } from '../app-injection-tokens';
import { Observable } from 'rxjs';
import { DVIRs } from '../models/dvirs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private http: HttpClient,
    @Inject(AUTH_API_URL) private apiUrl: string
  ) {}

  updateDVIR(dvir: DVIRs): Observable<object> {
    return this.http.post(this.apiUrl + 'api/EldDashboard/uploadDVIR', dvir);
  }
}
