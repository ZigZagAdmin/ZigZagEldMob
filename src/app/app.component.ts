import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Storage } from '@ionic/storage';
import { forkJoin, interval, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { ToastController, LoadingController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { InternetService } from './services/internet.service';

import { ManageService } from './services/manage.service';
import { DatabaseService } from './services/database.service';
import { LocationService } from './services/location.service';
import { Capacitor } from '@capacitor/core';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  pickedVehicle!: string;
  databaseSubscription: Subscription | undefined;
  networkStatus = false;
  networkSub!: Subscription;
  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private databaseService: DatabaseService,
    private authService: AuthService,
    private manageService: ManageService,
    private internetService: InternetService,
    private loadingController: LoadingController,
    private toastSerivice: ToastService,
    private locationService: LocationService
  ) {}

  async ngOnInit() {
    this.networkSub = this.internetService.internetStatus$.subscribe(status => {
      this.networkStatus = status;
    });
    this.loading = true;
    this.databaseSubscription = this.databaseService.isDatabaseReady().subscribe(async (ready: boolean) => {
      if (ready) {
        const accessToken = await this.storage.get('accessToken');
        const pickedVehicle = await this.storage.get('vehicleUnit');
        this.pickedVehicle = pickedVehicle;
        const user = await this.storage.get('user');
        const driverId = user?.DriverId;
        if (accessToken) {
          if (this.authService.isAuthenticated()) {
            const loading = await this.presentLoading();
            const fetchRequests = [
              this.manageService.getDrivers(driverId),
              this.manageService.getDrivers('ALL'),
              this.manageService.getCompany(),
              this.manageService.getVehicles(),
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
                  this.toastSerivice.showToast(errorMessage);
                  this.loading = false;
                  loading.dismiss();
                  return throwError(errorMessage);
                }),
                switchMap(([drivers, coDrivers, company, vehicles, terminals, elds, dvirs, logDailies, logEvents]) => {
                  const saveRequests = [
                    this.storage.set('drivers', drivers),
                    this.storage.set('coDrivers', coDrivers),
                    this.storage.set('company', company),
                    this.storage.set('dvirs', dvirs),
                    this.storage.set('vehicles', vehicles),
                    this.storage.set('terminals', terminals),
                    this.storage.set('elds', elds),
                    this.storage.set('logDailies', logDailies),
                    this.storage.set('logEvents', logEvents),
                  ];
                  return forkJoin(saveRequests).pipe(
                    catchError(error => {
                      const errorMessage = 'Error saving data to storage';
                      this.toastSerivice.showToast(errorMessage);
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
                  this.toastSerivice.showToast('Welcome Back!', 'success');
                },
                error => {
                  console.log(error);
                }
              );
          } else {
            await this.storage.remove('accessToken');
            this.loading = false;
            this.navCtrl.navigateForward('/login', { replaceUrl: true });
            this.toastSerivice.showToast('Access token has expired. Please log in again.', 'danger');
          }
        } else {
          await this.storage.remove('accessToken');
          this.loading = false;
          this.navCtrl.navigateForward('/login', { replaceUrl: true });
        }
      }
    });
    this.loading = true;
    if (this.pickedVehicle) {
      this.navCtrl.navigateForward('/connect-mac');
    } else {
      this.navCtrl.navigateForward('/select-vehicle');
    }
    this.loading = false;
  }

  ngOnDestroy(): void {
  }

  private async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading data...',
      spinner: 'bubbles',
    });
    await loading.present();
    return loading;
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
    this.networkSub.unsubscribe();
  }
}
