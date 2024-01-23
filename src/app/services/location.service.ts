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

  initialize() {
    alert('something');
    this.checkLocationStatus();
  }

  private checkLocationStatus() {
    Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 0 }).then(a => {
      alert(a.coords.altitude + ' ' + a.timestamp);
      Geolocation.watchPosition({ timeout: 0, maximumAge: 0, enableHighAccuracy: true }, (data, err) => {
        alert(data.coords.altitude);
        alert(err);
        if (data) this.locationStatusSubject.next(true);
        else this.locationStatusSubject.next(false);
      })
        .then(s => alert('Then:' + s))
        .catch(e => alert('error: ' + e));
    }).catch(e => alert('Position error: ' + e));
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
