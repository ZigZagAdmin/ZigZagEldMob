import { Injectable } from '@angular/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  private bluetoothStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  constructor() {}

  async getBluetoothState() {
    return await BleClient.isEnabled();
  }

  async requestBluetoothPermission() {
    await BleClient.requestEnable().then(() => this.bluetoothStatusSubject.next(true), () => this.bluetoothStatusSubject.next(false));
  }

}
