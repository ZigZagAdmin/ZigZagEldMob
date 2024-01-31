import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { firstValueFrom, forkJoin } from 'rxjs';
import { Driver } from 'src/app/models/driver';
import { ICoDriver, LogDailies } from 'src/app/models/log-dailies';
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
  coDriverNames: string[] = ['None', 'something', 'somethign', 'something'];
  loading: boolean = false;

  coDriver: ICoDriver | {};

  logDailies: LogDailies[] = [];

  constructor(private navCtrl: NavController, private toastService: ToastService, private storage: Storage, private databaseService: DatabaseService, private dashboardService: DashboardService) {}

  async ngOnInit() {
    let coDriver$ = this.storage.get('coDriver');
    let logDailies$ = firstValueFrom(this.databaseService.getLogDailies());

    forkJoin([coDriver$, logDailies$]).subscribe(([coDriver, logDailies]) => {
      this.coDriver = coDriver;
      this.logDailies = logDailies;
      if(Object.keys(this.coDriver).length === 0) {
        this.chosenDriver = 'None';
      } else {
        this.chosenDriver = (this.coDriver as ICoDriver).name;
      }
    });
  }

  async save() {
    this.loading = true;
    this.logDailies[0].form.coDriver = this.coDriver as ICoDriver;
    await this.storage.set('coDriver', this.coDriver);
    await this.dashboardService
      .updateLogDaily(this.logDailies[0])
      .toPromise()
      .then(async response => {
        console.log('LogDaily (durationStatuses) is updated on server:', response);
        await this.storage.set('logDailies', this.logDailies);
        this.goBack();
        this.loading = false;
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
      this.coDriver = {};
    } else {
      this.coDriver = this.coDrivers.find((coDriver) => coDriver.name === this.chosenDriver);
    }
    if (this.chosenDriver.length !== 0 && this.chosenDriver !== 'None') this.toastService.showToast(this.chosenDriver + ' is now your co-driver', 'medium');
  }

  goBack() {
    this.navCtrl.navigateBack('unitab/others');
  }
}
