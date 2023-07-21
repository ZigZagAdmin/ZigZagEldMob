import { Component, OnInit } from '@angular/core';
import { AuthUser } from 'src/app/models/auth-user';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

import { ToastController } from '@ionic/angular';

import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { ManageService } from 'src/app/services/manage.service';

import { Company } from 'src/app/models/company';
import { Driver } from 'src/app/models/driver';
import { Terminal } from 'src/app/models/terminal';
import { Vehicle } from 'src/app/models/vehicle';
import { ELD } from 'src/app/models/eld';
import { LogDailies } from 'src/app/models/log-dailies';
import { LogHistories } from 'src/app/models/log-histories';
import { DVIRs } from 'src/app/models/dvirs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private manageService: ManageService,
    private databaseService: DatabaseService,
    private toastController: ToastController,
    private storage: Storage,
    private navCtrl: NavController
  ) {}

  loading: boolean = false;
  focused = false;
  authUser!: AuthUser;

  ngOnInit() {
    // this.checkBluetoothStatus();
  }

  // checkBluetoothStatus() {
  //   BleClient.isEnabled()
  //     .then((isEnabled) => {
  //       if (isEnabled) {
  //         console.log('Bluetooth is enabled');
  //         // Продолжайте логику входа (login) здесь
  //       } else {
  //         console.log('Bluetooth is disabled');
  //         // Выводите системное окно с запросом включения Bluetooth здесь
  //         // Продолжайте логику входа (login) независимо от ответа пользователя
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error checking Bluetooth status:', error);
  //       // Обработка ошибки при проверке состояния Bluetooth
  //       // Продолжайте логику входа (login) здесь или обработайте ошибку соответствующим образом
  //     });
  // }

  onBlur(event: any) {
    const value = event.target.value;

    if (!value) {
      this.focused = false;
    }
  }

  login(username: string, password: string) {
    this.loading = true; // Показать спиннер

    this.authService
      .login(username, password)
      .pipe(
        switchMap((res) => {
          this.authUser = res;
          this.storage.set('accessToken', res.AccessToken);
          localStorage.setItem('accessToken', res.AccessToken);
          return this.saveAuthUser(res);
        }),
        switchMap(() => {
          const fetchRequests = [
            this.manageService.getDrivers(),
            this.manageService.getCompany(),
            this.manageService.getVehicles(),
            this.manageService.getTerminals(),
            this.manageService.getELDs(),
            this.manageService.getDVIRs(),
            this.manageService.getLogDailies(
              this.authUser.DriverId,
              formatDate(new Date(), 'yyyy-MM-dd', 'en_US'),
              14
            ),
            this.manageService.getLogHistories14Days(this.authUser.DriverId),
          ];

          return forkJoin(fetchRequests).pipe(
            catchError((error) => {
              const errorMessage = 'Error fetching data';
              this.presentToast(errorMessage); // Отобразить toast с ошибкой
              return throwError(errorMessage);
            })
          );
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
            const saveRequests = [
              this.saveDrivers(drivers as Driver[]),
              this.saveCompany(company as Company),
              this.saveVehicles(vehicles as Vehicle[]),
              this.saveTerminals(terminals as Terminal[]),
              this.saveDVIRs(dvirs as DVIRs[]),
              this.saveELDs(elds as ELD[]),
              this.saveLogDailies(logDailies as LogDailies[]),
              this.saveLogHistories(logHistories as LogHistories[]),
            ];

            return forkJoin(saveRequests).pipe(
              catchError((error) => {
                const errorMessage = 'Error saving data to database';
                this.presentToast(errorMessage); // Отобразить toast с ошибкой
                return throwError(errorMessage);
              })
            );
          }
        ),
        finalize(() => {
          this.loading = false; // Скрыть спиннер
        })
      )
      .subscribe(
        () => {
          // Все запросы и сохранения выполнены успешно
          this.presentToast('Login successful', 'success'); // Отобразить toast с сообщением об успешном входе
          this.navCtrl.navigateForward('/select-vehicle');
        },
        (error) => {
          // Обработка ошибки
          const errorMessage = 'An error occurred during login';
          this.presentToast(errorMessage, 'danger'); // Отобразить toast с ошибкой
          console.log(errorMessage);
        }
      );
  }

  private saveAuthUser(authUser: AuthUser): Observable<any> {
    return this.databaseService.saveAuthUser(authUser).pipe(
      catchError((error) => {
        const errorMessage = 'Error saving auth user to database';
        this.presentToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveDrivers(drivers: Driver[]): Observable<any> {
    return this.databaseService.saveDrivers(drivers).pipe(
      catchError((error) => {
        const errorMessage = 'Error saving drivers to database';
        this.presentToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveCompany(company: Company): Observable<any> {
    return this.databaseService.saveCompany(company).pipe(
      catchError((error) => {
        const errorMessage = 'Error saving company to database';
        this.presentToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveVehicles(vehicles: Vehicle[]): Observable<any> {
    return this.databaseService.saveVehicles(vehicles).pipe(
      catchError((error) => {
        const errorMessage = 'Error saving vehicles to database';
        this.presentToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveTerminals(terminals: Terminal[]): Observable<any> {
    return this.databaseService.saveTerminals(terminals).pipe(
      catchError((error) => {
        const errorMessage = 'Error saving terminals to database';
        this.presentToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveELDs(elds: ELD[]): Observable<any> {
    return this.databaseService.saveELDs(elds).pipe(
      catchError((error) => {
        const errorMessage = 'Error saving ELDs to database';
        this.presentToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveDVIRs(dvirs: DVIRs[]): Observable<any> {
    return this.databaseService.saveDvirs(dvirs).pipe(
      catchError((error) => {
        const errorMessage = 'Error saving dvirs to database';
        this.presentToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveLogDailies(logDailies: LogDailies[]): Observable<any> {
    return this.databaseService.saveLogDailies(logDailies).pipe(
      catchError((error) => {
        const errorMessage = 'Error saving log dailies to database';
        this.presentToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private saveLogHistories(logHistories: LogHistories[]): Observable<any> {
    return this.databaseService.saveLogHistories(logHistories).pipe(
      catchError((error) => {
        const errorMessage = 'Error saving log histories to database';
        this.presentToast(errorMessage); // Отобразить toast с ошибкой
        return throwError(errorMessage);
      })
    );
  }

  private async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
    });
    toast.present();
  }

  //   login(username: string, password: string) {
  //     this.loading = true;
  //     this.authService
  //       .login(username, password)
  //       .pipe(
  //         switchMap((res) => {
  //           this.authUser = res;
  //           this.databaseService.saveAuthUser(res as AuthUser).subscribe(() => {
  //             console.log('AuthUser saved in the database.');
  //           });

  //           const fetchRequests = [
  //             this.manageService.getDrivers(),
  //             this.manageService.getCompany(),
  //             this.manageService.getVehicles(),
  //             this.manageService.getTerminals(),
  //             this.manageService.getELDs(),
  //             this.manageService.getLogDailies(
  //               res.DriverId,
  //               formatDate(new Date(), 'yyyy-MM-dd', 'en_US'),
  //               14
  //             ),
  //             this.manageService.getLogHistories14Days(res.DriverId),
  //           ];

  //           return forkJoin(fetchRequests).pipe(
  //             catchError((error) => {
  //               console.log(error);
  //               alert('Ошибка при выполнении запросов: ' + error.message);
  //               return throwError(error);
  //             })
  //           );
  //         }),
  //         catchError((error) => {
  //           console.log(error);
  //           const errorMessage = 'Invalid Username or Password';
  //           console.log(errorMessage);
  //           return throwError(errorMessage);
  //         })
  //       )
  //       .subscribe(
  //         ([
  //           drivers,
  //           company,
  //           vehicles,
  //           terminals,
  //           elds,
  //           logDailies,
  //           logHistories,
  //         ]) => {
  //           console.log('Drivers:', JSON.stringify(drivers));
  //           console.log('Company:', JSON.stringify(company));
  //           console.log('Vehicles:', JSON.stringify(vehicles));
  //           console.log('Terminals:', JSON.stringify(terminals));
  //           console.log('ELDs:', JSON.stringify(elds));
  //           console.log('Log Dailies:', JSON.stringify(logDailies));
  //           console.log('Log Histories:', JSON.stringify(logHistories));

  //           this.databaseService
  //             .saveDrivers(drivers as Driver[])
  //             .subscribe(() => {
  //               console.log('Drivers saved in the database.');
  //             });

  //           this.databaseService.saveCompany(company as Company).subscribe(() => {
  //             console.log('Company saved in the database.');
  //           });

  //           this.databaseService
  //             .saveVehicles(vehicles as Vehicle[])
  //             .subscribe(() => {
  //               console.log('Vehicles saved in the database.');
  //             });

  //           this.databaseService
  //             .saveTerminals(terminals as Terminal[])
  //             .subscribe(() => {
  //               console.log('Terminals saved in the database.');
  //             });

  //           this.databaseService.saveELDs(elds as ELD[]).subscribe(() => {
  //             console.log('ELDs saved in the database.');
  //           });

  //           this.databaseService
  //             .saveLogDailies(logDailies as LogDailies[])
  //             .subscribe(() => {
  //               console.log('Log Dailies saved in the database.');
  //             });

  //           this.databaseService
  //             .saveLogHistories(logHistories as LogHistories[])
  //             .subscribe(() => {
  //               console.log('Log Histories saved in the database.');
  //             });

  //           this.loading = false;
  //           this.route.navigate(['/select-vehicle']);
  //         },
  //         (error) => {
  //           console.log(error);
  //           const errorMessage = 'An error occurred during login';
  //           console.log(errorMessage);
  //           this.loading = false;
  //           // Обработка ошибки во время выполнения запросов
  //         }
  //       );
  //   }
  // }
}
