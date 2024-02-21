import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { seasonChanges, timeZoneSummer, timeZoneWinter } from '../models/timeZone';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(private storage: Storage) {}

  public generateString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  validateForm(object: any): boolean {
    let result = true;
    for (const key in object) {
      result = result && object[key];
    }
    return result;
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  msToTime(duration: number) {
    let seconds: string | number = Math.floor((duration / 1000) % 60);
    let minutes: string | number = Math.floor((duration / (1000 * 60)) % 60);
    let hours: string | number = Math.floor(duration / (1000 * 60 * 60));

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return hours + 'h ' + minutes + 'min ' + seconds + 's';
  }

  checkSeason() {
    if (
      new Date().getTime() >= seasonChanges[new Date().getFullYear().toString() as keyof typeof seasonChanges].summer &&
      new Date().getTime() < seasonChanges[new Date().getFullYear().toString() as keyof typeof seasonChanges].winter
    ) {
      return timeZoneSummer;
    } else {
      return timeZoneWinter;
    }
  }

  getEldLocation(value: string) {
    return value.split(',').map(el => parseFloat(el));
  }
}
