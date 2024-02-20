import { Injectable } from '@angular/core';
import { PlacesCity } from '../models/places-city';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private placesCity: PlacesCity[] = [];

  constructor(private storage: Storage) {}

  public async getCurrentLocation(latitude: number, longitude: number): Promise<string> {
    console.log(latitude, longitude);
    let dDistanceFinal = 0;
    let sCurrentLocationDescription: string = '';
    await this.storage.get('placesCity').then(res => (this.placesCity = res));
    try {
      for (const cityPlace of this.placesCity) {
        let dLatitude: number = cityPlace.latitude !== null && cityPlace.latitude !== undefined ? cityPlace.latitude : 0;
        let dLongitude: number = cityPlace.longitude !== null && cityPlace.longitude !== undefined ? cityPlace.longitude : 0;

        let dDistance: number =
          3959 *
          Math.acos(
            Math.cos(this.toRadians(latitude)) * Math.cos(this.toRadians(dLatitude)) * Math.cos(this.toRadians(dLongitude) - this.toRadians(longitude)) +
              Math.sin(this.toRadians(latitude)) * Math.sin(this.toRadians(dLatitude))
          );

        if (dDistanceFinal == 0) {
          dDistanceFinal = dDistance;
        }

        if (dDistanceFinal > dDistance) {
          dDistanceFinal = dDistance;

          let sCurrentCountryCode: string = cityPlace.countryCode;
          let sCurrentStateProvinceCode: string = cityPlace.stateProvinceCode;
          let sCurrentCity: string = cityPlace.city;

          if (dDistanceFinal > 1) {
            let sCardinalDetailed = this.degreesToCardinalDetailed(this.calculateBearingAngle(dLatitude, dLongitude, latitude, longitude));
            sCurrentLocationDescription = Math.round(dDistanceFinal) + '.0mi ' + sCardinalDetailed + ' from ' + sCurrentCity + ', ' + sCurrentStateProvinceCode;
          } else {
            sCurrentLocationDescription = sCurrentCity + ', ' + sCurrentStateProvinceCode;
          }
        }
      }
    } catch (e) {
      sCurrentLocationDescription = '';
    }

    return sCurrentLocationDescription;
  }

  public toRadians(angleIn10thofaDegree: number): number {
    return (angleIn10thofaDegree * Math.PI) / 180;
  }

  public convertDegreesToRadians(angle: number): number {
    return (Math.PI * angle) / 180;
  }

  public convertRadiansToDegrees(angle: number): number {
    return (180 * angle) / Math.PI;
  }

  public calculateBearingAngle(startLatitude: number, startLongitude: number, endLatitude: number, endLongitude: number): number {
    let longitude1: number = this.convertDegreesToRadians(startLongitude);
    let latitude1: number = this.convertDegreesToRadians(startLatitude);

    let longitude2: number = this.convertDegreesToRadians(endLongitude);
    let latitude2: number = this.convertDegreesToRadians(endLatitude);

    let longDiff: number = longitude1 - longitude2;

    let y: number = Math.sin(longDiff) * Math.cos(latitude2);
    let x: number = Math.cos(latitude1) * Math.sin(latitude2) - Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(longDiff);

    return (this.convertRadiansToDegrees(Math.atan2(y, x)) + 360) % 360;
  }

  public degreesToCardinalDetailed(degrees: number): string {
    let caridnals: string[] = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
    return caridnals[Math.round((((360 - degrees) * 10) % 3600) / 225)];
  }
}
