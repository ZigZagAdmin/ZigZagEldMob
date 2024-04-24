import { Injectable, NgZone } from '@angular/core';
import { BleClient, numberToUUID } from '@capacitor-community/bluetooth-le';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { BehaviorSubject } from 'rxjs';

declare let cordova: any;

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  private bluetoothStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private deviceConnectionStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private bluetoothDataSubject: BehaviorSubject<{ [key: string]: string }> = new BehaviorSubject<{ [key: string]: string }>(null);

  service = numberToUUID(0x1800);
  read = '00002A00-0000-1000-8000-00805F9B34FB';

  private debounceTimeout: any;
  private debounceDelay: number = 5000;

  constructor(private platform: Platform, private translate: TranslateService, private ngZone: NgZone) {}

  async initialize() {
    await BleClient.initialize({ androidNeverForLocation: true });
  }

  async watchBluetoothStatus() {
    this.platform.ready().then(() => {
      cordova.plugins.diagnostic.registerBluetoothStateChangeHandler(
        (state: any) => {
          console.log('bluetooth state: ', state);
          console.log(state === cordova.plugins.diagnostic.bluetoothState.POWERED_ON);
          if (state === cordova.plugins.diagnostic.bluetoothState.POWERED_ON) {
            this.bluetoothStatusSubject.next(true);
          } else {
            this.bluetoothStatusSubject.next(false);
          }
        },
        (error: any) => {
          this.bluetoothStatusSubject.next(false);
        }
      );
    });
  }

  async goToBluetoothServiceSettings() {
    return new Promise<boolean>(resolve => {
      this.platform.ready().then(() => {
        cordova.plugins.diagnostic.switchToBluetoothSettings();
      });
    });
  }

  async getBluetoothState() {
    return new Promise<boolean>(resolve => {
      this.platform.ready().then(() => {
        cordova.plugins.diagnostic.isBluetoothAvailable(
          (enabled: any) => {
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

  async getBluetoothAuthorizationStatus() {
    return new Promise<{ value: string; status: boolean }>(resolve => {
      this.platform.ready().then(() => {
        cordova.plugins.diagnostic.getBluetoothAuthorizationStatus(
          (res: any) => {
            let state;
            switch (res) {
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
            }
            console.log('bluetooth authorization state:', state);
            resolve({ value: res, status: state });
          },
          (error: any) => {
            console.error('Error checking location availability:', error);
            resolve({ value: error, status: false });
          }
        );
      });
    });
  }

  async requestBluetoothPermission(noPop?: boolean) {
    return new Promise<{ value: string; status: boolean }>((resolve, reject) => {
      this.platform.ready().then(() => {
        cordova.plugins.diagnostic.requestBluetoothAuthorization(
          async (accuracyAuthorization: any) => {
            let status;
            console.log('Authorization: ', accuracyAuthorization);
            switch (accuracyAuthorization['BLUETOOTH_CONNECT']) {
              case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                status = false;
                this.bluetoothStatusSubject.next(false);
                break;
              case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
                status = false;
                this.bluetoothStatusSubject.next(false);
                if (!noPop) {
                  alert(this.translate.instant('You need to give bluetooth permissions in order to connect'));
                }
                break;
              case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                status = false;
                this.bluetoothStatusSubject.next(false);
                if (!noPop) {
                  let state = confirm(this.translate.instant('You need to give access to your bluetooth.\nProceed to settings?'));
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
                this.bluetoothStatusSubject.next(true);
                break;
              case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                status = false;
                this.bluetoothStatusSubject.next(true);
                break;
            }
            resolve({ value: accuracyAuthorization, status: status });
          },
          (error: any) => {
            console.error('Error requesting bluetooth authorization:', error);
            reject({ value: error, status: false });
          },
          ['BLUETOOTH_SCAN', 'BLUETOOTH_CONNECT']
        );
      });
    });
  }

  getBluetoothStatusObservable() {
    return this.bluetoothStatusSubject.asObservable();
  }

  getBluetoothDataObservable() {
    return this.bluetoothDataSubject.asObservable();
  }

  getDeviceConnectionStatusObservable() {
    return this.deviceConnectionStatus.asObservable();
  }

  async connectToDevice(macAddress: string = 'FC:29:99:B8:78:0E') {
    try {
      // await BleClient.requestLEScan({}, () => {});
      await BleClient.connect(macAddress);
      console.log('Connected macAdrress: ', macAddress);
      this.deviceConnectionStatus.next(true);
      return true;
    } catch (error) {
      console.error('Bluetooth error ' + macAddress + ':', error);
      this.deviceConnectionStatus.next(false);
      return false;
    }
  }

  async listAvailableDevices() {
    try {
      const result = await BleClient.requestDevice();
      console.log('Available devices:', JSON.stringify(result));
    } catch (error) {
      console.error('Bluetooth error:', error);
    }
  }

  async readDeviceDate(macAddress: string = 'FC:29:99:B8:78:0E') {
    const res = await BleClient.read(macAddress, this.service, this.read);
    this.decodeJ1708(res);
  }

  async subscribeToDeviceData(macAddress: string = 'FC:29:99:B8:78:0E') {
    // const macAddress: string = 'FC:29:99:B8:78:0E';
    let dataReceivedTimeout: any;

    const handleDataTimeout = () => {
      console.log('No data received in 15 seconds, assuming disconnection');
      this.deviceConnectionStatus.next(false);
    };

    const resetDataReceivedTimeout = () => {
      if (dataReceivedTimeout) {
        clearTimeout(dataReceivedTimeout);
      }
      dataReceivedTimeout = setTimeout(handleDataTimeout, 15000); // 15 seconds
    };

    resetDataReceivedTimeout();
    this.ngZone.runOutsideAngular(async () => {
      await BleClient.startNotifications(macAddress, '6e400001-b5a3-f393-e0a9-e50e24dcca9e', '6e400003-b5a3-f393-e0a9-e50e24dcca9e', res => {
        if (this.debounceTimeout) {
          clearTimeout(this.debounceTimeout);
        }
        this.debounceTimeout = setTimeout(() => {
          if (res) {
            console.log('current heart rate', this.parseData(res));
            this.bluetoothDataSubject.next(this.decodeJ1708(res));
            resetDataReceivedTimeout();
          } else {
            this.deviceConnectionStatus.next(false);
          }
        }, this.debounceDelay);

        return () => {
          clearTimeout(dataReceivedTimeout);
          if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
          }
        };
      });
    });
  }

  async getServices(macAddress: string = 'FC:29:99:B8:78:0E') {
    await BleClient.getServices(macAddress).then(res => {
      console.log('Bluetooth services:', JSON.stringify(res));
      res.forEach(el => {
        console.log(el.uuid);
        console.log(JSON.stringify(el.characteristics));
      });
    });
  }

  decodeJ1708(dataView: DataView) {
    const payload = new Uint8Array(dataView.buffer, dataView.byteOffset, dataView.byteLength); // Читаем все данные

    console.log('JSON:', JSON.stringify(payload));
    console.log('Payload:decoder', new TextDecoder().decode(payload));
    return this.parseStringData(new TextDecoder().decode(payload));
  }

  parseStringData(message: string) {
    let array = message.split('&');
    let temp: { [key: string]: string } = {};
    array.forEach(el => {
      let test = el.split('=');
      temp[test[0]] = test[1];
    });
    temp['V'] = temp['V'] ? temp['V'] : '0';
    temp['O'] = temp['O'] ? temp['O'] : '0';
    temp['H'] = temp['H'] ? temp['H'] : '0';
    temp['R'] = temp['R'] ? temp['R'] : '0';

    console.log('Speed: ', temp['V']);
    console.log('Odometers: ', temp['O']);
    console.log('EngineHours: ', temp['H']);
    console.log('RPM: ', temp['R']);
    return temp;
  }

  parseData(value: DataView): number {
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let heartRate: number;
    if (rate16Bits > 0) {
      heartRate = value.getUint16(1, true);
    } else {
      heartRate = value.getUint8(1);
    }
    return heartRate;
  }
}
