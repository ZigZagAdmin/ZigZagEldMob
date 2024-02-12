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

@Component({
  selector: 'app-connect-mac',
  templateUrl: './connect-mac.page.html',
  styleUrls: ['./connect-mac.page.scss'],
})
export class ConnectMacPage implements OnInit, OnDestroy {
  pickedVehicle!: string;
  macAddress: string = '';
  vehicle: Vehicle;

  defects = defectsVehicle;

  validation: { [key: string]: boolean } = {
    macAddress: false,
  };

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private storageService: DatabaseService,
    private utilityService: UtilityService,
    private shareService: ShareService,
    private bluetoothService: BluetoothService
  ) {}

  async ngOnInit() {
    if (Capacitor.getPlatform() !== 'web') {
      await this.bluetoothService.requestBluetoothPermission(true);
    }
  }

  ngOnDestroy(): void {
    this.shareService.destroyMessage();
  }

  getVehicle() {
    this.storageService.getVehicles().subscribe(
      res => {
        this.vehicle = res[0];
      },
      error => console.log(error)
    );
  }

  goBack() {
    this.navCtrl.navigateBack('/select-vehicle');
  }

  ionViewWillEnter() {
    this.getVehicle();

    this.storage.get('vehicleUnit').then(pickedVehicle => {
      this.pickedVehicle = pickedVehicle;
    });
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

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 1000);
  }
}
