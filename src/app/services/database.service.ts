import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, throwError, Subscription, BehaviorSubject } from 'rxjs';
import { Driver } from '../models/driver';
import { Company } from '../models/company';
import { Vehicle } from '../models/vehicle';
import { Terminal } from '../models/terminal';
import { ELD } from '../models/eld';
import { LogDailies } from '../models/log-dailies';
import { LogEvents } from '../models/log-histories';
import { User } from '../models/user';
import { AuthUser } from '../models/auth-user';
import { DVIRs } from '../models/dvirs';
import { PlacesCity } from '../models/places-city';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private databaseReady: boolean = false;
  databaseReadySubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  databaseReadySubscription: Subscription | undefined;
  constructor(private storage: Storage) {
    this.create();
  }

  async create(): Promise<void> {
    try {
      await this.storage.create();
      this.databaseReady = true;
      this.databaseReadySubject.next(true);
    } catch (error) {
      console.error(error);
    }
  }

  isDatabaseReady(): Observable<boolean> {
    return this.databaseReadySubject.asObservable();
  }

  saveDrivers(drivers: Driver[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.set('drivers', drivers));
  }

  saveCoDrivers(drivers: Driver[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.set('coDrivers', drivers));
  }

  getDrivers(): Observable<Driver[]> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.get('drivers'));
  }

  saveAuthUser(user: AuthUser): Observable<void> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.set('user', user));
  }

  getUser(): Observable<User> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.get('user'));
  }

  saveCompany(company: Company): Observable<void> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.set('company', company));
  }

  getCompany(): Observable<Company> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.get('company'));
  }

  saveVehicles(vehicles: Vehicle[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.set('vehicles', vehicles));
  }

  getVehicles(): Observable<Vehicle[]> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.get('vehicles'));
  }

  saveTerminals(terminals: Terminal[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.set('terminals', terminals));
  }

  getTerminals(): Observable<Terminal[]> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.get('terminals'));
  }

  saveELDs(elds: ELD[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.set('elds', elds));
  }

  getELDs(): Observable<ELD[]> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.get('elds'));
  }

  saveLogDailies(logDailies: LogDailies[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.set('logDailies', logDailies));
  }

  getLogDailies(): Observable<LogDailies[]> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.get('logDailies'));
  }

  saveLogEvents(logEvents: LogEvents[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.set('logEvents', logEvents));
  }

  getLogEvents(): Observable<LogEvents[]> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.get('logEvents'));
  }

  saveDvirs(dvirs: DVIRs[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.set('dvirs', dvirs));
  }

  getDvirs(): Observable<DVIRs[]> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.get('dvirs'));
  }

  savePlacesCity(placesCity: PlacesCity[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.set('placesCity', placesCity));
  }

  getPlacesCity(): Observable<PlacesCity[]> {
    if (!this.databaseReady) {
      return throwError('База данных не создана. Сначала вызовите метод create()');
    }
    return from(this.storage.get('placesCity'));
  }
}
