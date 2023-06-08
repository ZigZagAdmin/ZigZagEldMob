import { Component, OnInit } from '@angular/core';
import { AuthUser } from 'src/app/models/auth-user';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { Platform } from '@ionic/angular';
declare var cordova: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [BluetoothSerial],
})
export class LoginPage implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private locationAccuracy: LocationAccuracy,
    private authService: AuthService,
    private route: Router,
    private platform: Platform
  ) {}

  focused = false;
  authUser!: AuthUser;

  ngOnInit() {
    this.checkBluetoothAndGpsPermission();
  }

  checkBluetoothAndGpsPermission() {
    if (this.isIOS()) {
      this.requestBluetoothPermissionIOS();
      this.requestGPSPermissionIOS();
    } else if (this.isAndroid()) {
      this.requestBluetoothPermissionAndroid();
      this.requestGPSPermissionAndroid();
    }
  }

  requestBluetoothPermissionIOS() {
    cordova.plugins.iosPermissions.requestPermission(
      cordova.plugins.iosPermissions.BLUETOOTH_PERIPHERAL,
      () => {
        this.enableBluetooth();
      },
      (error: any) => {
        console.log('Error requesting Bluetooth permission:', error);
      }
    );
  }

  requestBluetoothPermissionAndroid() {
    cordova.plugins.permissions.requestPermission(
      cordova.plugins.permissions.BLUETOOTH,
      (status: any) => {
        if (status.hasPermission) {
          this.enableBluetooth();
        } else {
          console.log('Bluetooth permission not granted');
        }
      },
      (error: any) => {
        console.log('Error requesting Bluetooth permission:', error);
      }
    );
  }

  requestGPSPermissionIOS() {
    cordova.plugins.iosPermissions.requestPermission(
      cordova.plugins.iosPermissions.LOCATION_ALWAYS,
      () => {
        this.enableGPS();
      },
      (error: any) => {
        console.log('Error requesting GPS permission:', error);
      }
    );
  }

  requestGPSPermissionAndroid() {
    this.locationAccuracy
      .canRequest()
      .then((canRequest: boolean) => {
        if (canRequest) {
          this.enableGPS();
        } else {
          console.log('GPS permission not granted');
        }
      })
      .catch((error: any) => {
        console.log('Error checking GPS permission:', error);
      });
  }

  enableGPS() {
    this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(() => {
        console.log('GPS enabled');
        // Другая логика вашего входа
      })
      .catch((error: any) => {
        console.log('Error enabling GPS:', error);
      });
  }

  enableBluetooth() {
    this.bluetoothSerial
      .enable()
      .then(() => {
        console.log('Bluetooth enabled');
        // Другая логика вашего входа
      })
      .catch((error: any) => {
        console.log('Error enabling Bluetooth:', error);
      });
  }

  isIOS() {
    return this.platform.is('ios');
  }

  isAndroid() {
    return this.platform.is('android');
  }

  onBlur(event: any) {
    const value = event.target.value;

    if (!value) {
      this.focused = false;
    }
  }

  login(username: string, password: string) {
    this.authService.login(username, password).subscribe(
      (res) => {
        this.authUser = res;
        console.log(JSON.stringify(res));
        this.route.navigate(['/select-vehicle']);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
