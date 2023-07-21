import { Component, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicle';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-vehicle',
  templateUrl: './select-vehicle.page.html',
  styleUrls: ['./select-vehicle.page.scss'],
})
export class SelectVehiclePage implements OnInit {
  databaseSubscription: Subscription | undefined;
  bReady: boolean = false;
  showBackButton: boolean = false;
  pickedVehicle = '';
  vehicles: Vehicle[] = [];
  constructor(
    private navCtrl: NavController,
    private databaseService: DatabaseService,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.databaseSubscription = this.databaseService
      .isDatabaseReady()
      .subscribe((ready: boolean) => {
        if (ready) {
          this.bReady = ready;
          this.databaseService.getVehicles().subscribe((vehicles) => {
            this.vehicles = vehicles;
            console.log(this.vehicles);
          });
        }
      });
  }

  ionViewWillEnter() {
    const storedValue = localStorage.getItem('showBackButton');
    this.showBackButton =
      storedValue !== null ? JSON.parse(storedValue) : false;
    if (this.bReady) {
      this.databaseService.getVehicles().subscribe((vehicles) => {
        this.vehicles = vehicles;
        console.log(this.vehicles);
      });
    }
  }

  ionViewWillLeave() {
    localStorage.removeItem('showBackButton');
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 1000);
  }

  selectVehicle(vehicle: Vehicle) {
    if (!this.showBackButton) {
      console.log('Selected vehicle:', vehicle);
      this.pickedVehicle = vehicle.VehicleUnit;
      this.storage.set('pickedVehicle', this.pickedVehicle);
      localStorage.setItem('pickedVehicle', this.pickedVehicle);
      this.navCtrl.navigateForward('/connect-mac');
    } else {
      console.log('Selected vehicle:', vehicle);
      this.pickedVehicle = vehicle.VehicleUnit;
      this.storage.set('pickedVehicle', this.pickedVehicle);
      localStorage.setItem('pickedVehicle', this.pickedVehicle);
      this.navCtrl.navigateBack('/others');
    }
  }
}
