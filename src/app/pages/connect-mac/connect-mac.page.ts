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

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private databaseService: DatabaseService,
    private utilityService: UtilityService,
    private shareService: ShareService,
    private bluetoothService: BluetoothService
  ) {}

  async ngOnInit() {
    if (Capacitor.getPlatform() !== 'web') {
      await this.bluetoothService.requestBluetoothPermission(true);
    }
  }

  async ionViewWillEnter() {
    let vehicles$ = firstValueFrom(this.databaseService.getVehicles());
    // let elds$ = firstValueFrom(this.databaseService.getELDs());

    forkJoin([vehicles$]).subscribe(([vehicles]) => {
      this.vehicle = vehicles[0];
      this.pickedVehicle = this.vehicle.vehicleUnit;
      // this.elds = elds;
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

  continueDisconected() {
    this.navCtrl.navigateRoot('/unitab', { animated: true, animationDirection: 'forward' });
  }

  redirectToVehicle() {
    this.navCtrl.navigateBack('/select-vehicle', { replaceUrl: true });
  }

  async connect() {
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
    this.shareService.changeMessage(this.utilityService.generateString(5));
    if (!this.utilityService.validateForm(this.validation)) return;
    if (Capacitor.getPlatform() !== 'web') {
      this.bluetoothService.connectToDevice(this.macAddress);
    }
  }

  async connectToELD() {}
}
