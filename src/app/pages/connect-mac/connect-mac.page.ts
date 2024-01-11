import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Vehicle } from 'src/app/models/vehicle';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-connect-mac',
  templateUrl: './connect-mac.page.html',
  styleUrls: ['./connect-mac.page.scss'],
})
export class ConnectMacPage implements OnInit {
  pickedVehicle!: string;
  macAddress: string = '';
  vehicle: Vehicle;

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private storageService: DatabaseService
  ) {}

  ngOnInit() {}

  getVehicle() {
    this.storageService.getVehicles().subscribe(
      (res) => {
        this.vehicle = res[0];
        console.log(res);
      },
      (error) => console.log(error)
    );
  }

  goBack() {
    this.navCtrl.navigateBack('/select-vehicle');
  }

  ionViewWillEnter() {
    this.getVehicle();

    this.storage.get('pickedVehicle').then((pickedVehicle) => {
      this.pickedVehicle = pickedVehicle;
    });
  }

  async getLocation() {
    const location = await Geolocation.getCurrentPosition();
    console.log('location = ', location);
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
