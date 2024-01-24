import { Injectable } from '@angular/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  private bluetoothStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  constructor() {}

  async initialize() {
    await BleClient.initialize().catch(e => this.requestBluetoothPermission());
  }

  async getBluetoothState() {
    this.bluetoothStatusSubject.next(await BleClient.isEnabled().catch(() => false));
    return await BleClient.isEnabled().catch(() => false);
  }

  async requestBluetoothPermission(must?: string, not?: string) {
    await BleClient.requestEnable()
      .then(
        () => this.bluetoothStatusSubject.next(true),
        async () => {
          if (must) {
            let message = not ? 'You need to to give bluetooth permissions!' : 'You must enable bluetooth to use this feature!';
            let state = confirm(message + '\n Proceed to settings?');
            if (state) {
              await NativeSettings.open({
                optionAndroid: AndroidSettings.ApplicationDetails,
                optionIOS: IOSSettings.App,
              });
            } else {
              this.bluetoothStatusSubject.next(false);
            }
          } else {
            this.bluetoothStatusSubject.next(false);
          }
        }
      )
      .catch(e => this.bluetoothStatusSubject.next(false));
  }

  getBluetoothStatusObservable() {
    return this.bluetoothStatusSubject.asObservable();
  }
}
