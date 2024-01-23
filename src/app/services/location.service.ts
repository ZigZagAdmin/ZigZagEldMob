import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private locationStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor() {}

  async checkLocationStatus() {
    await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 0 })
      .then(async a => {
        this.locationStatusSubject.next(true);
      })
      .catch(e => this.locationStatusSubject.next(false));
  }

  getLocationStatusObservable() {
    return this.locationStatusSubject.asObservable();
  }

  async checkLocationServices(): Promise<boolean> {
    return await Geolocation.checkPermissions()
      .then(() => true)
      .catch(() => false);
  }

  async requestPermission(): Promise<void> {
    let res = await Geolocation.requestPermissions({ permissions: ['location', 'coarseLocation'] });
    console.log(res);
    if (res.location === 'denied' || res.coarseLocation === 'denied') {
      let confirmSettings = confirm('Go to settings and grant location permission.');
      if (confirmSettings)
        await NativeSettings.open({
          optionAndroid: AndroidSettings.ApplicationDetails,
          optionIOS: IOSSettings.App,
        });
    }
  }

  async checkPermission(): Promise<boolean> {
    // console.log(await Geolocation.checkPermissions());
    return (await Geolocation.checkPermissions()).location === 'granted' && (await Geolocation.checkPermissions()).coarseLocation === 'granted';
  }
}
