import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Storage } from '@ionic/storage';
import { forkJoin, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { ToastController, LoadingController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { InternetService } from './services/internet.service';

import { ManageService } from './services/manage.service';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
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
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    this.networkSub = this.internetService.internetStatus$.subscribe(
      (status) => {
        this.networkStatus = status;
      }
    );

    this.loading = true; // Показать прогрузочное окно
    console.log(this.loading);
    this.databaseSubscription = this.databaseService
      .isDatabaseReady()
      .subscribe(async (ready: boolean) => {
        if (ready) {
          const accessToken = await this.storage.get('accessToken');
          const pickedVehicle = await this.storage.get('pickedVehicle');
          this.pickedVehicle = pickedVehicle;
          const user = await this.storage.get('user');
          const driverId = user?.DriverId;
          if (accessToken) {
            if (this.authService.isAuthenticated()) {
              const loading = await this.presentLoading();
              const fetchRequests = [
                this.manageService.getDrivers(),
                this.manageService.getCompany(),
                this.manageService.getVehicles(),
                this.manageService.getTerminals(),
                this.manageService.getELDs(),
                this.manageService.getDVIRs(),
                this.manageService.getLogDailies(
                  driverId,
                  formatDate(new Date(), 'yyyy-MM-dd', 'en_US'),
                  14
                ),
                this.manageService.getLogHistories14Days(driverId),
              ];
              forkJoin(fetchRequests)
                .pipe(
                  catchError((error) => {
                    const errorMessage = 'Error fetching data';
                    this.presentToast(errorMessage); // Отобразить toast с ошибкой
                    this.loading = false;
                    loading.dismiss();
                    return throwError(errorMessage);
                  }),
                  switchMap(
                    ([
                      drivers,
                      company,
                      vehicles,
                      terminals,
                      elds,
                      dvirs,
                      logDailies,
                      logHistories,
                    ]) => {
                      // Сохранение данных в storage
                      const saveRequests = [
                        this.storage.set('drivers', drivers),
                        this.storage.set('company', company),
                        this.storage.set('dvirs', dvirs),
                        this.storage.set('vehicles', vehicles),
                        this.storage.set('terminals', terminals),
                        this.storage.set('elds', elds),
                        this.storage.set('logDailies', logDailies),
                        this.storage.set('logHistories', logHistories),
                      ];
                      return forkJoin(saveRequests).pipe(
                        catchError((error) => {
                          const errorMessage = 'Error saving data to storage';
                          this.presentToast(errorMessage); // Отобразить toast с ошибкой
                          return throwError(errorMessage);
                        }),
                        tap(() => {
                          loading.dismiss();
                          this.loading = false;
                          console.log(this.loading); // Скрыть прогрузочное окно
                          if (pickedVehicle) {
                            this.navCtrl.navigateForward('/connect-mac');
                          } else {
                            this.navCtrl.navigateForward('/select-vehicle');
                          }
                        })
                      );
                    }
                  )
                )
                .subscribe(
                  () => {
                    this.presentToast('Welcome Back!', 'success');
                  },
                  (error) => {
                    console.log(error);
                  }
                );
            } else {
              await this.storage.remove('accessToken');
              this.loading = false;
              console.log(this.loading);
              this.navCtrl.navigateForward('/login');
              this.presentToast(
                'Access token has expired. Please log in again.',
                'danger'
              );
            }
          } else {
            await this.storage.remove('accessToken');
            this.loading = false;
            console.log(this.loading);
            this.navCtrl.navigateForward('/login');
          }
        }
      });

    // this.loading = true;
    // console.log(this.loading);
    // if (this.pickedVehicle) {
    //   this.navCtrl.navigateForward('/connect-mac');
    // } else {
    //   this.navCtrl.navigateForward('/select-vehicle');
    // }
    // this.presentToast('Welcome Back!', 'success');
    // this.loading = false;
    // console.log(this.loading);
  }

  private async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
    });
    toast.present();
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
