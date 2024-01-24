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

@Component({
  selector: 'app-connect-mac',
  templateUrl: './connect-mac.page.html',
  styleUrls: ['./connect-mac.page.scss'],
})
export class ConnectMacPage implements OnInit, OnDestroy {
  pickedVehicle!: string;
  macAddress: string = '';
  vehicle: Vehicle;

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
    await this.bluetoothService.initialize();
    await this.bluetoothService.requestBluetoothPermission();
  }

  ngOnDestroy(): void {
    this.shareService.destroyMessage();
  }

  getVehicle() {
    this.storageService.getVehicles().subscribe(
      res => {
        this.vehicle = res[0];
        console.log(res);
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
    console.log('location = ', location);
  }

  continueDisconected() {
    this.navCtrl.navigateRoot('/unitab', { animated: true, animationDirection: 'forward' });
  }

  redirectToVehicle() {
    this.navCtrl.navigateBack('/select-vehicle', { replaceUrl: true });
  }

  async connect() {
    // this.shareService.changeMessage(this.utilityService.generateString(5));
    // if (!this.utilityService.validateForm(this.validation)) return;
    this.bluetoothService.initialize();
    if (!(await this.bluetoothService.getBluetoothState())) {
      await this.bluetoothService.requestBluetoothPermission('must');
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 1000);
  }
}
