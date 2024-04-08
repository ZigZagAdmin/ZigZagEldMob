import { Component, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicle';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { AnimationBuilder, NavController } from '@ionic/angular';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
import { Driver, IAssignedVehicle } from 'src/app/models/driver';
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
  driver: Driver;
  company: Company;

  constructor(private navCtrl: NavController, private databaseService: DatabaseService, private storage: Storage) {}

  async ngOnInit() {
    this.databaseSubscription = this.databaseService.isDatabaseReady().subscribe(async (ready: boolean) => {
      if (ready) {
        this.bReady = ready;

        let vehicles$ = firstValueFrom(this.databaseService.getVehicles());
        let drivers$ = firstValueFrom(this.databaseService.getDrivers());
        let company$ = firstValueFrom(this.databaseService.getCompany());

        forkJoin([vehicles$, drivers$, company$]).subscribe(([vehicles, drivers, company]) => {
          this.vehicles = vehicles;
          if (drivers && drivers.length !== 0) this.driver = drivers[0];
          this.company = company;
          this.storage.set('HoursOfServiceRuleDays', this.driver?.driverInfo?.settings.hoursOfService.days);
          this.storage.set('HoursOfServiceRuleHours', this.driver?.driverInfo?.settings.hoursOfService.hours);
          this.storage.set('timeZone', this.company?.mainOffice.timeZoneCode);
        });

        // await firstValueFrom(this.databaseService.getVehicles()).then(vehicles => {
        //   this.vehicles = vehicles;
        // });
        // await firstValueFrom(this.databaseService.getDrivers()).then(driver => {
        //   if (driver) this.driver = driver[0];
        //   this.storage.set('HoursOfServiceRuleDays', this.driver?.driverInfo?.settings.hoursOfService.days);
        //   this.storage.set('HoursOfServiceRuleHours', this.driver?.driverInfo?.settings.hoursOfService.hours);
        // });
        // await firstValueFrom(this.databaseService.getCompany()).then(company => {
        //   this.company = company;
        //   this.storage.set('timeZone', this.company?.mainOffice.timeZoneCode);
        // });
      }
    });
  }

  ionViewWillEnter() {
    const storedValue = localStorage.getItem('showBackButton');
    this.showBackButton = storedValue !== null ? JSON.parse(storedValue) : false;
    if (this.bReady) {
      this.databaseService.getDrivers().subscribe(driver => {
        if (driver) this.driver = driver[0];
      });
    }
  }


  // handleRefresh(event: any) {
  //   setTimeout(() => {
  //     event.target.complete();
  //   }, 1000);
  // }

  selectVehicle(vehicle: IAssignedVehicle) {
    this.storage.set('vehicleId', vehicle.vehicleId);
    this.storage.set('vehicleUnit', vehicle.vehicleUnit);
    this.storage.set('vehicles', [vehicle]);
    if (!this.showBackButton) {
      this.navCtrl.navigateForward('/connect-mac');
    } else {
      this.navCtrl.navigateBack('/unitab/others', { replaceUrl: true });
    }
  }

  ionViewWillLeave() {
    localStorage.removeItem('showBackButton');
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
  }

  goBack() {
    this.navCtrl.navigateBack('unitab/others');
  }
}
