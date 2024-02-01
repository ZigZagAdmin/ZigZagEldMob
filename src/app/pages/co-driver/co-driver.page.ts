import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { firstValueFrom, forkJoin } from 'rxjs';
import { Driver } from 'src/app/models/driver';
import { LogDailies } from 'src/app/models/log-dailies';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-co-driver',
  templateUrl: './co-driver.page.html',
  styleUrls: ['./co-driver.page.scss'],
})
export class CoDriverPage implements OnInit {
  chosenDriver: string = 'None';

  coDrivers: Driver[] = [];
  coDriverNames: string[] = [];
  loading: boolean = false;

  coDriver: Driver | Partial<Driver>;

  logDailies: LogDailies[] = [];

  pageLoading: boolean = false;

  constructor(private navCtrl: NavController, private toastService: ToastService, private storage: Storage, private databaseService: DatabaseService, private dashboardService: DashboardService) {}

  async ngOnInit() {
    this.pageLoading = true;
    let driverId$ = this.storage.get('driverId');
    let coDriver$ = this.storage.get('coDriver');
    let coDrivers$ = this.storage.get('coDrivers');
    let logDailies$ = firstValueFrom(this.databaseService.getLogDailies());

    forkJoin([driverId$, coDriver$, coDrivers$, logDailies$]).subscribe(([driverId, coDriver, coDrivers, logDailies]) => {
      this.coDriver = coDriver;
      coDrivers.forEach((el: Driver) => (el.driverId !== driverId ? this.coDrivers.push(el) : null));
      this.coDrivers.forEach(el => this.coDriverNames.push(el.name));
      this.coDriverNames.unshift('None');
      this.logDailies = logDailies;
      if (Object.keys(this.coDriver).length === 0) {
        this.chosenDriver = 'None';
      } else {
        if (this.coDriver.driverId === '00000000-0000-0000-0000-000000000000') {
          this.chosenDriver = 'None';
        } else {
          this.chosenDriver = (this.coDriver as Driver).name;
        }
      }
      this.pageLoading = false;
    });
  }

  async save() {
    this.loading = true;
    this.logDailies[0].form.coDriver = this.coDriver as Driver;
    await this.storage.set('coDriver', this.coDriver);
    await this.dashboardService
      .updateLogDaily(this.logDailies[0])
      .toPromise()
      .then(async response => {
        console.log('LogDaily (durationStatuses) is updated on server:', response);
        await this.storage.set('logDailies', this.logDailies);
        this.goBack();
        this.loading = false;
        if (this.chosenDriver.length !== 0 && this.chosenDriver !== 'None') this.toastService.showToast(this.chosenDriver + ' is now your co-driver', 'medium');
        if (this.chosenDriver.length !== 0 && this.chosenDriver === 'None') this.toastService.showToast('You have no co-driver now', 'medium');
      })
      .catch(async error => {
        await this.storage.set('logDailies', this.logDailies);
        console.log('Pushed in offline logDailies');
        this.goBack();
        this.loading = false;
      });
  }

  showSelection() {
    if (this.chosenDriver === 'None') {
      this.coDriver = {
        driverId: '00000000-0000-0000-0000-000000000000',
        driverIdentifier: null,
        driverInfo: null,
        email: null,
        firstName: null,
        lastName: null,
      };
    } else {
      this.coDriver = this.coDrivers.find(coDriver => coDriver.name === this.chosenDriver) || {
        driverId: '00000000-0000-0000-0000-000000000000',
        driverIdentifier: null,
        driverInfo: null,
        email: null,
        firstName: null,
        lastName: null,
      };
    }
  }

  goBack() {
    this.navCtrl.navigateBack('unitab/others');
  }
}
