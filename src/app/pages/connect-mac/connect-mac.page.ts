import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Vehicle } from 'src/app/models/vehicle';
import { DatabaseService } from 'src/app/services/database.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ShareService } from 'src/app/services/share.service';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { Capacitor } from '@capacitor/core';
import { defectsVehicle } from 'src/app/utilities/defects';
import { firstValueFrom, forkJoin } from 'rxjs';
import { ELD } from 'src/app/models/eld';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Company } from 'src/app/models/company';
import { TranslateService } from '@ngx-translate/core';
import { BleClient, ScanResult } from '@capacitor-community/bluetooth-le';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-connect-mac',
  templateUrl: './connect-mac.page.html',
  styleUrls: ['./connect-mac.page.scss'],
})
export class ConnectMacPage implements OnInit, OnDestroy {
  pickedVehicle!: string;
  macAddress: string = '';
  vehicle: Vehicle;
  elds: ELD[] = [];
  company: Company;
  isScanModalOpen: boolean = false;

  defects = defectsVehicle;

  validation: { [key: string]: boolean } = {
    macAddress: false,
  };

  loading: boolean = false;
  backUrl: string = '';
  firstLogin: boolean = false;
  availableDevices: string[] = [];
  scanModalId = '';
  scanModalIdValue = 'scan-modal-trigger';
  deviceQueue: ScanResult[] = [];
  activeTimeouts: any = [];

  constructor(
    private navCtrl: NavController,
    private databaseService: DatabaseService,
    private utilityService: UtilityService,
    private shareService: ShareService,
    private bluetoothService: BluetoothService,
    private toastService: ToastService,
    private storage: Storage,
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    let _firstLogin = localStorage.getItem('firstLogin');
    if (_firstLogin && _firstLogin.length !== 0) this.firstLogin = Boolean(_firstLogin);
  }

  async ionViewWillEnter() {
    this.shareService.changeMessage('reset');
    let vehicles$ = firstValueFrom(this.databaseService.getVehicles());
    let company$ = firstValueFrom(this.databaseService.getCompany());
    let elds$ = firstValueFrom(this.databaseService.getELDs());
    let lastConnectedELD$ = this.storage.get('lastConnectedELD');
    let queryParams$ = firstValueFrom(this.route.queryParams);

    forkJoin([vehicles$, elds$, lastConnectedELD$, queryParams$, company$]).subscribe(async ([vehicles, elds, lastConnectedELD, queryParams, company]) => {
      this.vehicle = vehicles[0];
      this.pickedVehicle = this.vehicle.vehicleUnit;
      this.company = company;
      this.elds = elds;
      if (queryParams['backUrl']) {
        this.backUrl = queryParams['backUrl'];
      }
      if (lastConnectedELD !== null && lastConnectedELD !== undefined && lastConnectedELD.length !== 0) {
        console.log('last connected eld: ', lastConnectedELD);
        await this.connect(lastConnectedELD, false);
      }
    });
  }

  async ionViewDidEnter() {
    if (!this.firstLogin) {
      alert('You need to provide bluetooth access in order to to connect to the ELD device!');
      localStorage.setItem('firstLogin', String(this.firstLogin));
    }
    if (Capacitor.getPlatform() !== 'web') {
      await this.bluetoothService.requestBluetoothPermission(true);
    }
  }

  ngOnDestroy(): void {
    this.shareService.destroyMessage();
  }

  goBack() {
    if (this.backUrl.length === 0) {
      this.navCtrl.navigateBack('/select-vehicle');
    } else {
      this.navigateToHos();
    }
  }

  navigateToHos() {
    this.navCtrl.navigateRoot('/unitab', { animated: true, animationDirection: 'forward' });
  }

  redirectToVehicle() {
    this.navCtrl.navigateBack('/select-vehicle', { replaceUrl: true });
  }

  async connect(macAddress: string, checkForForm: boolean = true) {
    console.log('SOMETHING', await this.bluetoothService.getBluetoothState());
    if (Capacitor.getPlatform() !== 'web') {
      if (
        (await this.bluetoothService.getBluetoothAuthorizationStatus()).value.toUpperCase() === 'DENIED_ALWAYS' ||
        (await this.bluetoothService.getBluetoothAuthorizationStatus()).value.toUpperCase() === 'DENIED_ONCE'
      ) {
        let confirmation = confirm(this.translate.instant('Bluetooth permission is required for connection to eld.\nProceed to settings?'));
        if (confirmation) {
          await this.openSettingsAndAwaitReturn();
          return;
        } else {
          alert(this.translate.instant('In order to connect to a device, you to give bluetooth permission!'));
          return;
        }
      } else if ((await this.bluetoothService.getBluetoothAuthorizationStatus()).value.toUpperCase() === 'NOT_REQUESTED') {
        try {
          await this.bluetoothService.requestBluetoothPermission();
        } catch (e) {
          console.error(e);
          return;
        }
      }
      if (!(await this.bluetoothService.getBluetoothState())) {
        let confirmation = confirm(this.translate.instant('Bluetooth service has to be turned on to connect to eld.\nProceed to settings?'));
        if (confirmation) {
          await this.openServiceSettingsAndAwaitReturn();
          return;
        } else {
          alert(this.translate.instant('In order to connect to a device, you to give bluetooth permission!'));
          return;
        }
      }
    }
    if (checkForForm) {
      this.shareService.changeMessage(this.utilityService.generateString(5));
      if (!this.utilityService.validateForm(this.validation)) return;
    }
    if (Capacitor.getPlatform() !== 'web') {
      try {
        await this.bluetoothService.initialize();
      } catch (e) {
        console.error(e);
      }
      this.loading = true;
      await this.bluetoothService.connectToDevice(macAddress).then(async res => {
        console.log('connection result: ', res);
        if (res) {
          this.loading = false;
          this.toastService.showToast(this.translate.instant('Device successfully connected'), 'success');
          await this.bluetoothService.subscribeToDeviceData(macAddress);
          await this.storage.set('lastConnectedELD', macAddress);
          await this.uploadEld(macAddress);
          this.navigateToHos();
        } else {
          this.loading = false;
          await this.storage.set('lastConnectedELD', '');
          this.toastService.showToast(this.translate.instant('Could not connect to') + ' ' + macAddress);
        }
      });
    }
  }

  async openServiceSettingsAndAwaitReturn() {
    await NativeSettings.open({
      optionAndroid: AndroidSettings.Bluetooth,
      optionIOS: IOSSettings.Bluetooth,
    });

    await new Promise<void>(resolve => {
      App.addListener('appStateChange', state => {
        if (state.isActive) {
          resolve();
        }
      });
    });
  }

  async openSettingsAndAwaitReturn() {
    await NativeSettings.open({
      optionAndroid: AndroidSettings.ApplicationDetails,
      optionIOS: IOSSettings.App,
    });

    await new Promise<void>(resolve => {
      App.addListener('appStateChange', state => {
        if (state.isActive) {
          resolve();
        }
      });
    });
  }

  async uploadEld(macAddress: string) {
    let index = this.elds.findIndex(el => el.macAddress === macAddress);
    if (this.macAddress === macAddress && index !== -1) {
      let eld: ELD = {
        eldId: this.utilityService.uuidv4(),
        companyId: this.company.companyId,
        name: 'Generic ELD',
        macAddress: macAddress,
        type: 'PT30',
        vehicleId: this.vehicle.vehicleId,
        vehicleUnit: this.vehicle.vehicleUnit,
        malfunctions: '',
        fwVersion: '1.0',
        status: '1',
      };
      this.elds.push(eld);
      await firstValueFrom(this.dashboardService.updateELD(eld))
        .then(async () => {
          await this.storage.set('elds', this.elds);
        })
        .catch(async () => {
          await this.storage.set('elds', this.elds);
        });
    }
  }

  canDeactivate() {
    return !this.loading;
  }

  async openScanner() {
    console.log('SOMETHING1', await this.bluetoothService.getBluetoothState());
    console.log('sdasdas: ', (await this.bluetoothService.getBluetoothAuthorizationStatus()).value.toUpperCase());
    if (Capacitor.getPlatform() !== 'web') {
      if (
        (await this.bluetoothService.getBluetoothAuthorizationStatus()).value.toUpperCase() === 'DENIED_ALWAYS' ||
        (await this.bluetoothService.getBluetoothAuthorizationStatus()).value.toUpperCase() === 'DENIED_ONCE'
      ) {
        let confirmation = confirm(this.translate.instant('Bluetooth permission is required for connection to eld.\nProceed to settings?'));
        if (confirmation) {
          await this.openSettingsAndAwaitReturn();
          return;
        } else {
          alert(this.translate.instant('In order to connect to a device, you to give bluetooth permission!'));
          return;
        }
      } else if ((await this.bluetoothService.getBluetoothAuthorizationStatus()).value.toUpperCase() === 'NOT_REQUESTED') {
        try {
          await this.bluetoothService.requestBluetoothPermission();
        } catch (e) {
          console.error(e);
          return;
        }
      }
      if (!(await this.bluetoothService.getBluetoothState())) {
        let confirmation = confirm(this.translate.instant('Bluetooth service has to be turned on to connect to eld.\nProceed to settings?'));
        if (confirmation) {
          await this.openServiceSettingsAndAwaitReturn();
          return;
        } else {
          alert(this.translate.instant('In order to connect to a device, you to give bluetooth permission!'));
          return;
        }
      }
    }
    if ((await this.bluetoothService.getBluetoothAuthorizationStatus()).value.toUpperCase() === 'AUTHORIZED' || (await this.bluetoothService.getBluetoothAuthorizationStatus()).value.toUpperCase() === 'GRANTED') {
      this.deviceQueue = [];
      let timeout = 1;
      this.isScanModalOpen = true;
      this.scanModalId = this.scanModalIdValue;
      try {
        await this.bluetoothService.initialize();
      } catch (e) {
        console.error(e);
      }
      await BleClient.requestLEScan({ allowDuplicates: false }, res => {
        this.deviceQueue.push(res);
        timeout = (this.deviceQueue.length - 1) * 750;
        let localTimeout = setTimeout(() => {
          this.availableDevices.push(
            `<div class="value-block"><div class="value-block-title">${res.device.name ? res.device.name : 'Generic device'}</div><div class="value-block-subtitle">MAC/UUID: ${
              res.device.deviceId
            }</div></div>`
          );
          this.changeDetectorRef.detectChanges();
        }, timeout);
        this.activeTimeouts.push(localTimeout);
      });
    }
  }

  async connectToSelectedScannedDevice(value: string) {
    this.isScanModalOpen = false;
    await BleClient.stopLEScan();
    const regex2 = /MAC\/UUID:\s*([\w:-]+)/g;
    let macAddress = regex2.exec(value)[1];
    this.loading = true;
    this.changeDetectorRef.detectChanges();
    await this.bluetoothService.connectToDevice(macAddress).then(async res => {
      if (res) {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
        this.toastService.showToast(this.translate.instant('Device successfully connected'), 'success');
        await this.bluetoothService.subscribeToDeviceData(macAddress);
        await this.storage.set('lastConnectedELD', macAddress);
        // await this.uploadEld(macAddress);
        this.navigateToHos();
      } else {
        this.loading = false;
        await this.storage.set('lastConnectedELD', '');
        this.changeDetectorRef.detectChanges();
        this.toastService.showToast(this.translate.instant('Could not connect to') + ' ' + macAddress);
      }
    });
    this.availableDevices = [];
  }

  async resetScan() {
    this.isScanModalOpen = false;
    await BleClient.stopLEScan();
    this.activeTimeouts.forEach((el: any) => clearTimeout(el));
    this.deviceQueue = [];
    setTimeout((): void => {
      this.availableDevices = [];
      this.changeDetectorRef.detectChanges();
      return;
    }, 500);
  }
  getPlatform() {
    return Capacitor.getPlatform();
  }
}
