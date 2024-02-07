import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthUser } from 'src/app/models/auth-user';
import { Observable, firstValueFrom, forkJoin, throwError } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { ManageService } from 'src/app/services/manage.service';

import { Company } from 'src/app/models/company';
import { Driver } from 'src/app/models/driver';
import { Terminal } from 'src/app/models/terminal';
import { Vehicle } from 'src/app/models/vehicle';
import { ELD } from 'src/app/models/eld';
import { LogDailies } from 'src/app/models/log-dailies';
import { LogEvents } from 'src/app/models/log-histories';
import { DVIRs } from 'src/app/models/dvirs';
import { PlacesCity } from 'src/app/models/places-city';
import { UtilityService } from 'src/app/services/utility.service';
import { ToastService } from 'src/app/services/toast.service';
import { ShareService } from 'src/app/services/share.service';
import { LocationService } from 'src/app/services/location.service';
import { Capacitor } from '@capacitor/core';
import { EncryptionService } from 'src/app/services/encryption.service';
import { Keyboard } from '@capacitor/keyboard';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  username = '';
  password = '';
  loading = false;
  focused = false;
  authUser!: AuthUser;
  validation: { [key: string]: boolean } = {
    username: false,
    password: false,
  };
  companyId: string = '';
  driverId: string = '';
  placesCity: PlacesCity[] = [];
  autoLogin: boolean = false;

  constructor(
    private authService: AuthService,
    private manageService: ManageService,
    private databaseService: DatabaseService,
    private toastService: ToastService,
    private storage: Storage,
    private navCtrl: NavController,
    private utilityService: UtilityService,
    private shareService: ShareService,
    private locationService: LocationService,
    private encryptionService: EncryptionService
  ) {}

  async ngOnInit() {
    this.placesCity = await this.storage.get('placesCity');
    await this.storage.get('autoLogin').then(async res => {
      if (res !== null && res !== undefined) {
        this.autoLogin = res;
      } else {
        this.autoLogin = false;
      }
      if (this.autoLogin) {
        let username = await this.storage.get('username').then(res => (res !== null && res !== undefined ? this.encryptionService.decrypt(res) : 'none'));
        let password = await this.storage.get('password').then(res => (res !== null && res !== undefined ? this.encryptionService.decrypt(res) : 'none'));
        if (username !== 'none' || password !== 'none') {
          this.username = username;
          this.password = password;
          this.validation['username'] = true;
          this.validation['password'] = true;
          // setTimeout(async () => await this.login(username, password), 0);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.shareService.destroyMessage();
  }

  async login(username: string, password: string) {
    if (Capacitor.getPlatform() !== 'web') {
      Keyboard.hide();
    }
    let networkStatus = await Network.getStatus();
    if (!networkStatus.connected) {
      this.toastService.showToast("You cannot login while you're offline!");
      return;
    }
    this.shareService.changeMessage(this.utilityService.generateString(5));
    if (!this.utilityService.validateForm(this.validation)) return;
    this.shareService.changeMessage('reset');

    if (Capacitor.getPlatform() !== 'web') {
      if (!(await this.locationService.checkLocationServices())) {
        alert('Please Turn On Location Service.\nGo to Settings -> Location -> Toggle on the Location Service.');
        return;
      }

      await this.locationService.requestPermission();

      if (!(await this.locationService.checkPermission())) {
        alert('The location permission is requiered to open the app.');
        return;
      }
    }

    this.loading = true; // Показать спиннер

    this.authService
      .login(username, password)
      .pipe(
        switchMap(res => {
          this.authUser = res;
          this.driverId = res.DriverId;
          this.companyId = res.CompanyId;
          this.storage.set('accessToken', res.AccessToken);
          this.storage.set('driverId', res.DriverId);
          this.storage.set('companyId', res.CompanyId);
          this.storage.set('name', res.Name);
          this.storage.set('language', res.Language);
          this.storage.set('username', this.encryptionService.encrypt(username));
          this.storage.set('password', this.encryptionService.encrypt(password));
          return this.saveAuthUser(res);
        }),
        switchMap(() => {
          let fetchRequests: (
            | Observable<Driver>
            | Observable<Company>
            | Observable<Vehicle[]>
            | Observable<Terminal[]>
            | Observable<ELD[]>
            | Observable<DVIRs[]>
            | Observable<LogDailies[]>
            | Observable<LogEvents[]>
            | Observable<PlacesCity[]>
          )[] = [
            this.manageService.getDrivers(this.authUser.DriverId),
            this.manageService.getDrivers('ALL'),
            this.manageService.getCompany(),
            // this.manageService.getVehicles(),
            this.manageService.getTerminals(),
            this.manageService.getELDs(),
            this.manageService.getDVIRs(),
            this.manageService.getLogDailies(this.authUser.DriverId, formatDate(new Date(), 'yyyy-MM-dd', 'en_US'), 14),
            this.manageService.getLogEvents(this.authUser.DriverId),
          ];

          const placesCity_ = this.manageService.getPlacesCity();
          if (!this.placesCity) {
            fetchRequests.push(placesCity_);
          }

          return forkJoin(fetchRequests).pipe(
            catchError(error => {
              const errorMessage = 'Error fetching data';
              this.toastService.showToast(errorMessage); // Отобразить toast с ошибкой
              return throwError(errorMessage);
            })
          );
        }),
        switchMap(([drivers, coDrivers, company, terminals, elds, dvirs, logDailies, logEvents, placesCity]) => {
          const saveRequests = [
            this.saveDrivers(drivers as Driver),
            this.saveCoDrivers(coDrivers as Driver),
            this.saveCompany(company as Company),
            // this.saveVehicles(vehicles as Vehicle[]),
            this.saveTerminals(terminals as Terminal[]),
            this.saveDVIRs(dvirs as DVIRs[]),
            this.saveELDs(elds as ELD[]),
            this.updateLogDailies(logDailies as LogDailies[]),
            this.saveLogEvents(logEvents as LogEvents[]),
          ];

          if (!this.placesCity) {
            const placesCity_ = this.savePlacesCity(placesCity as PlacesCity[]);
            saveRequests.push(placesCity_);
          }

          return forkJoin(saveRequests).pipe(
            catchError(error => {
              const errorMessage = 'Error saving data to database';
              this.toastService.showToast(errorMessage); // Отобразить toast с ошибкой
              return throwError(errorMessage);
            })
          );
        }),
        finalize(() => {
          this.loading = false; // Скрыть спиннер
        })
      )
      .subscribe(
        () => {
          // Все запросы и сохранения выполнены успешно
          this.storage.set('bAuthorized', false);
          this.toastService.showToast('Login successful', 'success'); // Отобразить toast с сообщением об успешном входе
          this.navCtrl.navigateRoot('/select-vehicle', { animated: true, animationDirection: 'forward' });
        },
        error => {
          console.log(error);
          const errorMessage = 'An error occurred during login';
          this.toastService.showToast(errorMessage, 'danger'); // Отобразить toast с ошибкой
          console.log(errorMessage);
        }
      );
  }

  private saveAuthUser(authUser: AuthUser): Observable<any> {
    return this.databaseService.saveAuthUser(authUser).pipe(
      catchError(error => {
        const errorMessage = 'Error saving auth user to database';
        this.toastService.showToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveDrivers(drivers: Driver): Observable<any> {
    return this.databaseService.saveDrivers(drivers).pipe(
      catchError(error => {
        const errorMessage = 'Error saving drivers to database';
        this.toastService.showToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveCoDrivers(drivers: Driver): Observable<any> {
    return this.databaseService.saveCoDrivers(drivers).pipe(
      catchError(error => {
        const errorMessage = 'Error saving drivers to database';
        this.toastService.showToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveCompany(company: Company): Observable<any> {
    return this.databaseService.saveCompany(company).pipe(
      catchError(error => {
        const errorMessage = 'Error saving company to database';
        this.toastService.showToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveVehicles(vehicles: Vehicle[]): Observable<any> {
    return this.databaseService.saveVehicles(vehicles).pipe(
      catchError(error => {
        const errorMessage = 'Error saving vehicles to database';
        this.toastService.showToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveTerminals(terminals: Terminal[]): Observable<any> {
    return this.databaseService.saveTerminals(terminals).pipe(
      catchError(error => {
        const errorMessage = 'Error saving terminals to database';
        this.toastService.showToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveELDs(elds: ELD[]): Observable<any> {
    return this.databaseService.saveELDs(elds).pipe(
      catchError(error => {
        const errorMessage = 'Error saving ELDs to database';
        this.toastService.showToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveDVIRs(dvirs: DVIRs[]): Observable<any> {
    if ((dvirs as Object).hasOwnProperty('code')) {
      dvirs = [];
    }
    return this.databaseService.saveDvirs(dvirs).pipe(
      catchError(error => {
        const errorMessage = 'Error saving dvirs to database';
        this.toastService.showToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private savePlacesCity(placesCity: PlacesCity[]): Observable<any> {
    return this.databaseService.savePlacesCity(placesCity).pipe(
      catchError(error => {
        const errorMessage = 'Error saving logMaps to database';
        this.toastService.showToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private getPlacesCity(): Observable<PlacesCity[]> {
    return this.databaseService.getPlacesCity().pipe(
      catchError(error => {
        const errorMessage = 'Error getting logMaps to database';
        this.toastService.showToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveLogDailies(logDailies: LogDailies[]): Observable<any> {
    return this.databaseService.saveLogDailies(logDailies).pipe(
      catchError(error => {
        const errorMessage = 'Error saving log dailies to database';
        this.toastService.showToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveLogEvents(logEvents: LogEvents[]): Observable<any> {
    return this.databaseService.saveLogEvents(logEvents).pipe(
      catchError(error => {
        const errorMessage = 'Error saving log histories to database';
        this.toastService.showToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private async updateLogDailies(logDailies: LogDailies[]) {
    let currentDate = new Date();
    let countDays = [];
    for (let i = 0; i < 14; i++) {
      const dateString = currentDate.toISOString().split('T')[0].replace(/-/g, '/');
      const foundLogDayIndex = logDailies.findIndex(logDay => logDay.logDate.includes(dateString));

      if (foundLogDayIndex !== -1) {
        countDays.push(logDailies[foundLogDayIndex]);
      } else {
        let newLogDaily: LogDailies = {
          logDailyId: this.utilityService.uuidv4(),
          companyId: this.companyId,
          driverId: this.driverId,
          driverName: '',
          logDate: dateString.replace(/-/g, '/'),
          timeOffDuty: 0,
          timeSleeper: 0,
          timeDriving: 0,
          timeOnDuty: 0,
          timeWorked: 0,
          violations: [],
          formManner: false,
          certified: false,
          form: {
            coDriver: {
              driverId: '00000000-0000-0000-0000-000000000000',
              driverIdentifier: null,
              driverInfo: null,
              email: null,
              firstName: null,
              lastName: null,
              companyId: '',
              name: '',
              emailConfirmed: '',
              userName: '',
              phoneNumber: '',
              simCard: '',
              deviceModel: '',
              operatingSystem: '',
              appVersion: '',
              status: false,
            },
            trailers: '',
            shippingDoc: '',
            fromAddress: '',
            toAddress: '',
            signatureId: '00000000-0000-0000-0000-000000000000',
          },
        };

        countDays.push(newLogDaily);
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    countDays.sort((a, b) => b.logDate.localeCompare(a.logDate));

    let todayLogDate = countDays.find(el => el.logDate === new Date().toISOString().split('T')[0].replace(/-/g, '/'));

    if (todayLogDate.form.coDriver.driverId === '00000000-0000-0000-0000-000000000000') {
      await this.storage.set('coDriver', {
        driverId: '00000000-0000-0000-0000-000000000000',
        driverIdentifier: null,
        driverInfo: null,
        email: null,
        firstName: null,
        lastName: null,
      });
    } else {
      await this.storage.set('coDriver', todayLogDate.form.coDriver);
    }

    await firstValueFrom(this.saveLogDailies(countDays));
  }

  forgotPassword() {}
}
