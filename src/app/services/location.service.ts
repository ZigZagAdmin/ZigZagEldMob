import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() {}

  async checkLocationServices(): Promise<boolean> {
    return await Geolocation.checkPermissions()
      .then(() => true)
      .catch(() => false);
  }

  async requestPermission(): Promise<void> {
    await Geolocation.requestPermissions({ permissions: ['location', 'coarseLocation'] }).then(res => {
      if (res.location === 'denied' || res.coarseLocation === 'denied') {
        NativeSettings.open({
          optionAndroid: AndroidSettings.ApplicationDetails,
          optionIOS: IOSSettings.App,
        });
      }
    });
  }

  async checkPermission(): Promise<boolean> {
    console.log(await Geolocation.checkPermissions());
    return (await Geolocation.checkPermissions()).location === 'granted' && (await Geolocation.checkPermissions()).coarseLocation === 'granted';
  }
}
