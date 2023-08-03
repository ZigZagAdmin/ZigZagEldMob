import { Component, OnInit } from '@angular/core';
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
  constructor(private storage: Storage, private navCtrl: NavController) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.storage.get('pickedVehicle').then((pickedVehicle) => {
      this.pickedVehicle = pickedVehicle;
    });
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
