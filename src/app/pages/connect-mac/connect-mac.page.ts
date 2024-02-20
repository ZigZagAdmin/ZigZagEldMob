import { Component, OnInit, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
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

  defects = defectsVehicle;

  validation: { [key: string]: boolean } = {
    macAddress: false,
  };

  loading: boolean = false;
  backUrl: string = '';

  constructor(
    private navCtrl: NavController,
    private databaseService: DatabaseService,
    private utilityService: UtilityService,
    private shareService: ShareService,
    private bluetoothService: BluetoothService,
    private toastService: ToastService,
    private storage: Storage,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    if (Capacitor.getPlatform() !== 'web') {
      await this.bluetoothService.requestBluetoothPermission(true);
    }
  }

  async ionViewWillEnter() {
    let vehicles$ = firstValueFrom(this.databaseService.getVehicles());
    let elds$ = firstValueFrom(this.databaseService.getELDs());
    let lastConnectedELD$ = this.storage.get('lastConnectedELD');
    let queryParams$ = firstValueFrom(this.route.queryParams);

    forkJoin([vehicles$, elds$, lastConnectedELD$, queryParams$]).subscribe(async ([vehicles, elds, lastConnectedELD, queryParams]) => {
      this.vehicle = vehicles[0];
      this.pickedVehicle = this.vehicle.vehicleUnit;
      this.elds = elds;
      console.log('query params: ', queryParams);
      if (queryParams['backUrl']) {
        this.backUrl = queryParams['backUrl'];
      }
      if (lastConnectedELD !== null && lastConnectedELD !== undefined && lastConnectedELD.length !== 0) {
        await this.connect(lastConnectedELD);
      }
    });
  }

  ngOnDestroy(): void {
    this.shareService.destroyMessage();
  }

  goBack() {
    this.navCtrl.navigateBack('/select-vehicle');
  }

  async getLocation() {
    const location = await Geolocation.getCurrentPosition();
  }

  navigateToHos() {
    this.navCtrl.navigateRoot('/unitab', { animated: true, animationDirection: 'forward' });
  }

  redirectToVehicle() {
    if (this.backUrl.length === 0) {
      this.navCtrl.navigateBack('/select-vehicle', { replaceUrl: true });
    } else {
      this.navigateToHos();
    }
  }

  async connect(macAddress: string, checkForForm: boolean = true) {
    if (Capacitor.getPlatform() !== 'web') {
      if (!(await this.bluetoothService.getBluetoothState())) {
        let confirmation = confirm('Bluetooth service is turned off.\nProceed to settings?');
        if (confirmation) {
          if (Capacitor.getPlatform() === 'android') {
            await this.bluetoothService.goToBluetoothServiceSettings();
          } else {
            alert('Go to Settings -> Bluetooth in order to enable the bluetooth service.');
          }
        } else {
          alert('In order to connect to a device, you to turn on the bluetooth service');
          return;
        }
      }
      await this.bluetoothService.requestBluetoothPermission();
    }
    if (checkForForm) {
      this.shareService.changeMessage(this.utilityService.generateString(5));
      if (!this.utilityService.validateForm(this.validation)) return;
    }
    if (Capacitor.getPlatform() !== 'web') {
      await this.bluetoothService.initialize();
      this.loading = true;
      await this.bluetoothService.connectToDevice(macAddress).then(async res => {
        console.log('connection result: ', res);
        if (res) {
          this.loading = false;
          this.toastService.showToast('Device successfully connected');
          await this.bluetoothService.subscribeToDeviceData(macAddress);
          await this.storage.set('lastConnectedELD', macAddress);
          this.navigateToHos();
        } else {
          this.loading = false;
          this.toastService.showToast('Could not connect to ' + macAddress);
        }
      });
    }
  }
}
