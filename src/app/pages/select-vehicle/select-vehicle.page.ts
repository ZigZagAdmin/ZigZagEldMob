import { Component, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicle';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Driver } from 'src/app/models/driver';
import { Company } from 'src/app/models/company';

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
  driver!: Driver;
  company!: Company;
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
          this.databaseService.getDrivers().subscribe((driver) => {
            this.driver = driver;
            this.storage.set(
              'HoursOfServiceRuleDays',
              this.driver.HoursOfServiceRuleDays
            );
            this.storage.set(
              'HoursOfServiceRuleHours',
              this.driver.HoursOfServiceRuleHours
            );
          });
          this.databaseService.getCompany().subscribe((company) => {
            this.company = company;
            this.storage.set('TimeZoneCity', this.company.TimeZoneCity);
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
      event.target.complete();
    }, 1000);
  }

  selectVehicle(vehicle: Vehicle) {
    if (!this.showBackButton) {
      console.log('Selected vehicle:', vehicle);
      this.pickedVehicle = vehicle.VehicleUnit;
      this.storage.set('pickedVehicle', this.pickedVehicle);
      this.storage.set('vehicleId', vehicle.VehicleId);
      localStorage.setItem('pickedVehicle', this.pickedVehicle);
      this.navCtrl.navigateForward('/connect-mac');
    } else {
      console.log('Selected vehicle:', vehicle);
      this.pickedVehicle = vehicle.VehicleUnit;
      this.storage.set('vehicleId', vehicle.VehicleId);
      this.storage.set('pickedVehicle', this.pickedVehicle);
      localStorage.setItem('pickedVehicle', this.pickedVehicle);
      this.navCtrl.navigateBack('/unitab/others');
    }
  }
}
