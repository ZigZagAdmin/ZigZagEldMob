import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, getPlatform } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Storage } from '@ionic/storage';
import { forkJoin, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { LoadingController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { InternetService } from './services/internet.service';

import { ManageService } from './services/manage.service';
import { DatabaseService } from './services/database.service';
import { ToastService } from './services/toast.service';
import { Network } from '@capacitor/network';
import { LocationService } from './services/location.service';
import { BluetoothService } from './services/bluetooth.service';
import { Capacitor } from '@capacitor/core';
import { TranslateService } from '@ngx-translate/core';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { svgPreloadUrls } from './utilities/svg-preloads';
// import { Driver } from './models/driver';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  pickedVehicle!: string;
  databaseSubscription: Subscription | undefined;
  lastNetworkStatus: boolean = null;
  networkSub!: Subscription;
  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private databaseService: DatabaseService,
    private authService: AuthService,
    private manageService: ManageService,
    private internetService: InternetService,
    private loadingController: LoadingController,
    private toastService: ToastService,
    private locationService: LocationService,
    private bluetoothService: BluetoothService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.ngZone.runOutsideAngular(() => this.preloadSVG());
  }

  async ngOnInit() {
    this.networkSub = this.internetService.interetStatusObs.subscribe(async status => {
      let currentStatus = await Network.getStatus();
      if (currentStatus.connected === true) {
        if (this.lastNetworkStatus === false) {
          this.toastService.showToast(this.translate.instant('You are back online!'), 'success');
          await this.internetService
            .postOfflineData()
            .then(async () => {
              this.toastService.showToast(this.translate.instant('All offline data uploaded successfully!'), 'success');
            })
            .catch(e => {
              this.toastService.showToast(this.translate.instant("There's been an error uploading the offline data!"), 'error');
              console.error(e);
            });
        }
      } else {
        this.toastService.showToast(this.translate.instant('You are now in Offline Mode!'), 'warning');
      }
      this.lastNetworkStatus = currentStatus.connected;
    });
    if (await KeepAwake.isSupported()) {
      await KeepAwake.keepAwake();
    }
    if (Capacitor.getPlatform() !== 'web') {
      this.locationService.watchLocationStatus();
      this.bluetoothService.watchBluetoothStatus();
    }
    console.log('AUTHENTICATED: ', this.authService.isAuthenticated());
    if (!this.authService.isAuthenticated()) {
      this.navCtrl.navigateForward('/login');
    } else {
      this.navCtrl.navigateForward('/select-vehicle');
    }
    this.loading = true;
    this.databaseSubscription = this.databaseService.isDatabaseReady().subscribe(async (ready: boolean) => {
      if (ready) {
        const accessToken = await this.storage.get('accessToken');
        const pickedVehicle = await this.storage.get('vehicleUnit');
        const darkMode = await this.storage.get('darkMode');
        document.body.classList.toggle('dark', darkMode);
        if (darkMode === null || darkMode === undefined) await this.storage.set('darkMode', false);
        this.pickedVehicle = pickedVehicle;
        const user = await this.storage.get('user');
        if (user) {
          await this.storage.set('language', user?.Language);
          let selectedLanguage = await this.storage.get('selectedLanguage');
          if (selectedLanguage === null || selectedLanguage === undefined) {
            selectedLanguage = user?.Language;
            await this.storage.set('selectedLanguage', user?.Language);
          }
          this.translate.setDefaultLang(selectedLanguage || 'en');
          this.translate.use(selectedLanguage || 'en');
        }
        const driverId = user?.DriverId;
        if (accessToken) {
          if (this.authService.isAuthenticated()) {
            const loading = await this.presentLoading();
            const fetchRequests = [
              this.manageService.getDrivers(driverId),
              this.manageService.getDrivers('ALL'),
              this.manageService.getCompany(),
              // this.manageService.getVehicles(),
              this.manageService.getTerminals(),
              this.manageService.getELDs(),
              this.manageService.getDVIRs(),
              this.manageService.getLogDailies(driverId, formatDate(new Date(), 'yyyy-MM-dd', 'en_US'), 14),
              this.manageService.getLogEvents(driverId, formatDate(new Date(), 'yyyy-MM-dd', 'en_US'), formatDate(new Date(), 'yyyy-MM-dd', 'en_US')),
            ];
            forkJoin(fetchRequests)
              .pipe(
                catchError(error => {
                  const errorMessage = 'Error fetching data';
                  console.warn(errorMessage);
                  this.loading = false;
                  loading.dismiss();
                  return throwError(errorMessage);
                }),
                switchMap(([drivers, coDrivers, company, terminals, elds, dvirs, logDailies, logEvents]) => {
                  const saveRequests = [
                    this.storage.set('drivers', drivers),
                    this.storage.set('coDrivers', coDrivers),
                    this.storage.set('company', company),
                    this.storage.set('dvirs', dvirs),
                    // this.storage.set('vehicles', (drivers as Driver[])[0]?.driverInfo?.assignedVehicles[0]),
                    this.storage.set('terminals', terminals),
                    this.storage.set('elds', elds),
                    this.storage.set('logDailies', logDailies),
                    this.storage.set('logEvents', logEvents),
                  ];
                  return forkJoin(saveRequests).pipe(
                    catchError(error => {
                      const errorMessage = 'Error saving data to storage';
                      console.warn(errorMessage);
                      return throwError(errorMessage);
                    }),
                    tap(() => {
                      loading.dismiss();
                      this.loading = false;
                      if (pickedVehicle) {
                        this.navCtrl.navigateForward('/connect-mac');
                      } else {
                        this.navCtrl.navigateForward('/select-vehicle');
                      }
                    })
                  );
                })
              )
              .subscribe(
                () => {
                  this.toastService.showToast(this.translate.instant('Welcome Back!'), 'success');
                },
                error => {
                  console.log(error);
                }
              );
          } else {
            await this.storage.remove('accessToken');
            this.loading = false;
            this.navCtrl.navigateForward('/login', { replaceUrl: true });
            this.toastService.showToast(this.translate.instant('Access token has expired. Please log in again.'), 'danger');
          }
        } else {
          await this.storage.remove('accessToken');
          this.loading = false;
          this.navCtrl.navigateForward('/login', { replaceUrl: true });
        }
      }
    });
    // this.loading = true;
    // if (this.pickedVehicle) {
    //   this.navCtrl.navigateForward('/connect-mac');
    // } else {
    //   this.navCtrl.navigateForward('/select-vehicle');
    // }
    // this.loading = false;
  }

  preloadSVG() {
    Promise.resolve().then(() => {
      svgPreloadUrls.forEach(el => {
        if (!document.querySelector(`link[href="${el}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = el;
          link.as = 'image';
          link.type = 'image/svg+xml';
          document.head.appendChild(link);
        }
      });
    });
  }

  ngOnDestroy(): void {
    console.log('App Component Destroy');
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
    this.networkSub.unsubscribe();
  }

  private async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.translate.instant('Loading data') + '...',
      spinner: 'bubbles',
      cssClass: 'loading-app-component',
    });
    await loading.present();
    return loading;
  }
}
