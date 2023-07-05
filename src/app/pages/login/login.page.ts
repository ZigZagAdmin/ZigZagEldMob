import { Component, OnInit } from '@angular/core';
import { AuthUser } from 'src/app/models/auth-user';
import { FormGroup, FormControl } from '@angular/forms';
import { forkJoin, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

import { BleClient } from '@capacitor-community/bluetooth-le';

import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { ManageService } from 'src/app/services/manage.service';

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
    private route: Router
  ) {}

  focused = false;
  authUser!: AuthUser;

  ngOnInit() {
    this.checkBluetoothStatus();
  }

  checkBluetoothStatus() {
    BleClient.isEnabled()
      .then((isEnabled) => {
        if (isEnabled) {
          console.log('Bluetooth is enabled');
          // Продолжайте логику входа (login) здесь
        } else {
          console.log('Bluetooth is disabled');
          // Выводите системное окно с запросом включения Bluetooth здесь
          // Продолжайте логику входа (login) независимо от ответа пользователя
        }
      })
      .catch((error) => {
        console.error('Error checking Bluetooth status:', error);
        // Обработка ошибки при проверке состояния Bluetooth
        // Продолжайте логику входа (login) здесь или обработайте ошибку соответствующим образом
      });
  }

  onBlur(event: any) {
    const value = event.target.value;

    if (!value) {
      this.focused = false;
    }
  }

  login(username: string, password: string) {
    this.authService
      .login(username, password)
      .pipe(
        switchMap((res) => {
          this.authUser = res;
          console.log(JSON.stringify(res));
          const fetchRequests = [
            this.manageService.getDrivers(),
            this.manageService.getCompany(),
            this.manageService.getVehicles(),
            this.manageService.getTerminals(),
            this.manageService.getELDs(),
            this.manageService.getLogDailies(
              res.DriverId,
              formatDate(new Date(), 'yyyy-MM-dd', 'en_US'),
              14
            ),
            this.manageService.getLogHistories14Days(res.DriverId),
          ];

          return forkJoin(fetchRequests).pipe(
            catchError((error) => {
              console.log(error);
              alert('Ошибка при выполнении запросов: ' + error.message);
              return throwError(error);
            })
          );
        }),
        catchError((error) => {
          console.log(error);
          const errorMessage = 'Invalid login or password';
          alert(errorMessage);
          return throwError(errorMessage);
        })
      )
      .subscribe(
        ([
          drivers,
          company,
          vehicles,
          terminals,
          elds,
          logDailies,
          logHistories,
        ]) => {
          console.log('Drivers:', JSON.stringify(drivers));
          console.log('Company:', JSON.stringify(company));
          console.log('Vehicles:', JSON.stringify(vehicles));
          console.log('Terminals:', JSON.stringify(terminals));
          console.log('ELDs:', JSON.stringify(elds));
          console.log('Log Dailies:', JSON.stringify(logDailies));
          console.log('Log Histories:', JSON.stringify(logHistories));

          // this.databaseService.saveDriverData(drivers);

          // Здесь вы можете записать полученные данные в локальную базу данных
          // Например, используя сервис для работы с базой данных
          // databaseService.saveDrivers(drivers);
          // databaseService.saveCompany(company);
          // и т.д.

          this.route.navigate(['/select-vehicle']);
        },
        (error) => {
          console.log(error);
          const errorMessage = 'An error occurred during login';
          alert(errorMessage);
          // Обработка ошибки во время выполнения запросов
        }
      );
  }
}

// import { Component, OnInit } from '@angular/core';
// import { AuthUser } from 'src/app/models/auth-user';
// import { FormGroup, FormControl } from '@angular/forms';
// import { forkJoin, throwError } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { formatDate } from '@angular/common';

// import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
// import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
// import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

// import { DatabaseService } from 'src/app/services/database.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { ManageService } from 'src/app/services/manage.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.page.html',
//   styleUrls: ['./login.page.scss'],
// })
// export class LoginPage implements OnInit {
//   loginForm = new FormGroup({
//     username: new FormControl(''),
//     password: new FormControl(''),
//   });

//   constructor(
//     private bluetoothSerial: BluetoothSerial,
//     private diagnostic: Diagnostic,
//     private androidPermissions: AndroidPermissions,
//     private authService: AuthService,
//     private manageService: ManageService,
//     private databaseService: DatabaseService,
//     private route: Router
//   ) {}

//   focused = false;
//   authUser!: AuthUser;

//   ngOnInit() {
//     this.checkBluetoothStatus();
//   }

//   checkBluetoothStatus() {
//     this.diagnostic.getBluetoothState().then((state) => {
//       if (state === this.diagnostic.bluetoothState.POWERED_ON) {
//         console.log('Bluetooth is enabled');
//       } else {
//         console.log('Bluetooth is disabled');
//         this.requestBluetoothPermissions();
//       }
//     });
//   }

//   requestBluetoothPermissions() {
//     this.androidPermissions
//       .requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN)
//       .then(() => {
//         this.enableBluetooth();
//       })
//       .catch((error) => {
//         console.log('Permission request failed:', error);
//       });
//   }

//   enableBluetooth() {
//     this.bluetoothSerial.enable().then(() => {
//       console.log('Bluetooth enabled');
//     });
//   }

//   onBlur(event: any) {
//     const value = event.target.value;

//     if (!value) {
//       this.focused = false;
//     }
//   }

//   login(username: string, password: string) {
//     this.authService
//       .login(username, password)
//       .pipe(
//         switchMap((res) => {
//           this.authUser = res;
//           console.log(JSON.stringify(res));
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
//           const errorMessage = 'Invalid login or password';
//           alert(errorMessage);
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

//           // this.databaseService.saveDriverData(drivers);

//           // Здесь вы можете записать полученные данные в локальную базу данных
//           // Например, используя сервис для работы с базой данных
//           // databaseService.saveDrivers(drivers);
//           // databaseService.saveCompany(company);
//           // и т.д.

//           this.route.navigate(['/select-vehicle']);
//         },
//         (error) => {
//           console.log(error);
//           const errorMessage = 'An error occurred during login';
//           alert(errorMessage);
//           // Обработка ошибки во время выполнения запросов
//         }
//       );
//   }
// }
