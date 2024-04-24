import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
import { BehaviorSubject } from 'rxjs';
import { GeolocationService } from './geolocation.service';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

declare let cordova: any;

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private locationStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(private geolocationService: GeolocationService, private platform: Platform, private translate: TranslateService) {}

  watchLocationStatus() {
    this.platform.ready().then(() => {
      cordova.plugins.diagnostic.registerLocationStateChangeHandler(
        (state: any) => {
          console.log('location state: ', state);
          if (state === 'location_off') {
            this.locationStatusSubject.next(false);
          } else {
            this.locationStatusSubject.next(true);
          }
        },
        (error: any) => {
          this.locationStatusSubject.next(false);
        }
      );
    });
  }

  async getCurrentLocation() {
    const geolocationPromise = Geolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: true })
      .then(async res => {
        return {
          locationType: 'AUTOMATIC',
          latitude: res.coords.latitude,
          longitude: res.coords.longitude,
          description: await this.geolocationService.getCurrentLocation(res.coords.latitude, res.coords.longitude),
        };
      })
      .catch(e => {
        return {
          locationType: 'MANUAL',
          latitude: 0,
          longitude: 0,
          description: '',
        };
      });

    const timeoutPromise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          locationType: 'MANUAL',
          latitude: 0,
          longitude: 0,
          description: '',
        });
      }, 10000);
    });

    return await Promise.race([geolocationPromise, timeoutPromise]);
  }

  getLocationStatusObservable() {
    return this.locationStatusSubject.asObservable();
  }

  async goToLocationServiceSettings() {
    return new Promise<boolean>(resolve => {
      this.platform.ready().then(() => {
        cordova.plugins.diagnostic.switchToLocationSettings();
      });
    });
  }

  async isLocationAvailable(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.platform.ready().then(() => {
        cordova.plugins.diagnostic.isLocationAvailable(
          (available: any) => {
            resolve(available);
          },
          (error: any) => {
            console.error('Error checking location availability:', error);
            resolve(false);
          }
        );
      });
    });
  }

  isLocationPermissionGranted(): Promise<{ value: string; status: boolean }> {
    return new Promise<{ value: string; status: boolean }>(resolve => {
      cordova.plugins.diagnostic.getLocationAuthorizationStatus(
        (status: any) => {
          let state: boolean;
          console.log('req permission', status);
          switch (status) {
            case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
              state = false;
              break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
              state = false;
              break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
              state = false;
              break;
            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
              state = true;
              break;
            case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
              state = true;
              break;
          }
          resolve({ value: status, status: state });
        },
        (error: any) => {
          resolve({ value: error, status: false });
        }
      );
    });
  }

  isLocationServiceAvailable() {
    return new Promise<boolean>(resolve => {
      this.platform.ready().then(() => {
        cordova.plugins.diagnostic.isLocationEnabled(
          (enabled: any) => {
            console.log('isLocationServiceAvailable: ', enabled)
            resolve(enabled);
          },
          (error: any) => {
            console.error('Error checking location availability:', error);
            resolve(false);
          }
        );
      });
    });
  }

  async requestPermission(pass: string) {
    return new Promise<{ value: string; status: boolean }>((resolve, reject) => {
      this.platform.ready().then(() => {
        cordova.plugins.diagnostic.requestLocationAuthorization(
          async (accuracyAuthorization: any) => {
            let status;
            console.log('Authorization: ', accuracyAuthorization);
            switch (accuracyAuthorization) {
              case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                status = false;
                this.locationStatusSubject.next(false);
                break;
              case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
                status = false;
                this.locationStatusSubject.next(false);
                // alert(this.translate.instant('You need to give location permissions in order to normally use the app'));
                break;
              case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                status = false;
                this.locationStatusSubject.next(false);
                if (pass !== 'pass') {
                  let state = confirm(this.translate.instant('You need to give access to your location.\nProceed to settings?'));
                  if (state) {
                    await NativeSettings.open({
                      optionAndroid: AndroidSettings.ApplicationDetails,
                      optionIOS: IOSSettings.App,
                    });
                  }
                }
                break;
              case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                status = false;
                this.locationStatusSubject.next(true);
                break;
              case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                status = false;
                this.locationStatusSubject.next(true);
                break;
            }
            resolve({ value: accuracyAuthorization, status: status });
          },
          (error: any) => {
            console.error('Error requesting location authorization:', error);
            reject({ value: error, status: false });
          },
          cordova.plugins.diagnostic.locationAuthorizationMode.WHEN_IN_USE,
          cordova.plugins.diagnostic.locationAccuracyAuthorization.FULL
        );
      });
    });
  }
}
