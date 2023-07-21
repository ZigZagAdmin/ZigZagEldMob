import { Component, OnInit } from '@angular/core';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-connect-mac',
  templateUrl: './connect-mac.page.html',
  styleUrls: ['./connect-mac.page.scss'],
})
export class ConnectMacPage implements OnInit {
  pickedVehicle!: string;
  macAddress: string = '';
  constructor(
    private bluetoothLE: BluetoothLE,
    private storage: Storage,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.storage.get('pickedVehicle').then((pickedVehicle) => {
      this.pickedVehicle = pickedVehicle;
    });
  }

  connectToDevice() {
    const params = {
      address: this.macAddress,
    };

    this.bluetoothLE.connect(params).subscribe(
      (success) => {
        alert(params);
        alert('Connected to PT-30U' + success);
        // Дальнейшая обработка успешного подключения
      },
      (error) => {
        alert('Failed to connect to PT-30U' + error.message);
        // Обработка ошибки подключения
      }
    );
  }

  continueDisconected() {
    this.navCtrl.navigateForward('/unitab');
  }

  redirectToVehicle() {
    this.navCtrl.navigateBack('/select-vehicle');
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 1000);
  }
}
