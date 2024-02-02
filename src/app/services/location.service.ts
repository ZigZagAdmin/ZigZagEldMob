import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
import { BehaviorSubject } from 'rxjs';
import { GeolocationService } from './geolocation.service';
import { Location } from 'src/app/models/dvirs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private locationStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(private geolocationService: GeolocationService) {}

  async checkLocationStatus() {
    await Geolocation.checkPermissions()
      .then(a => {
        if (a.location === 'granted' && a.coarseLocation === 'granted') {
          this.locationStatusSubject.next(true);
        } else {
          this.locationStatusSubject.next(false);
        }
      })
      .catch(e => this.locationStatusSubject.next(false));
  }

  async getCurrentLocation() {
    return await Geolocation.getCurrentPosition().then((res): Location => {
      return {
        locationType: 'AUTOMATIC',
        latitude: res.coords.latitude,
        longitude: res.coords.longitude,
        description: this.geolocationService.getCurrentLocation(res.coords.latitude, res.coords.longitude),
      };
    });
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
    return (await Geolocation.checkPermissions()).location === 'granted' && (await Geolocation.checkPermissions()).coarseLocation === 'granted';
  }
}
