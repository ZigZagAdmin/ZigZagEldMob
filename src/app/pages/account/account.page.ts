import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { firstValueFrom, forkJoin } from 'rxjs';
import { Company } from 'src/app/models/company';
import { Driver } from 'src/app/models/driver';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  driver: Driver;
  company: Company;
  language: string;
  pageLoading: boolean = false;
  timeZone: string = '';

  constructor(private navCtrl: NavController, private databaseService: DatabaseService, private storage: Storage) {}

  async ngOnInit() {
    this.pageLoading = true;
    let driver$ = firstValueFrom(this.databaseService.getDrivers());
    let company$ = firstValueFrom(this.databaseService.getCompany());
    let timeZone$ = this.storage.get('TimeZoneCity');
    let langauge$ = this.storage.get('language');

    forkJoin([driver$, company$, timeZone$, langauge$]).subscribe(([driver, company, timeZone, language]) => {
      this.driver = driver[0];
      this.company = company;
      this.timeZone = timeZone;
      this.language = language;
      this.language = this.language.toUpperCase();
    })
  }

  goBack() {
    this.navCtrl.navigateBack('unitab/others');
  }
}
