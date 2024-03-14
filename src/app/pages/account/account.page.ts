import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
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
  languages: { [key: string]: string } = {
    en: 'English',
    es: 'Español',
  };
  inputLanguage: string = '';
  languageOptions: string[] = ['English', 'Español'];

  constructor(private navCtrl: NavController, private databaseService: DatabaseService, private storage: Storage, private translate: TranslateService) {}

  async ngOnInit() {
    this.pageLoading = true;
    let driver$ = firstValueFrom(this.databaseService.getDrivers());
    let company$ = firstValueFrom(this.databaseService.getCompany());
    let timeZone$ = this.storage.get('timeZone');
    let language$ = this.storage.get('language');
    let selectedLanguage$ = this.storage.get('selectedLanguage');

    forkJoin([driver$, company$, timeZone$, language$, selectedLanguage$]).subscribe(([driver, company, timeZone, language, selectedLanguage]) => {
      this.driver = driver[0];
      this.company = company;
      this.timeZone = timeZone;
      if (selectedLanguage !== null && selectedLanguage !== undefined) this.language = selectedLanguage;
      else this.language = language;
      this.inputLanguage = this.languages[this.language];
      this.pageLoading = false;
    });
  }

  async showSelection(value: any) {
    if (value !== undefined && value !== null && value.length !== 0) {
      let key = Object.keys(this.languages).find(key => this.languages[key] === value);
      await this.storage.set('selectedLanguage', key);
      this.translate.setDefaultLang(key);
      this.translate.use(key);
    }
  }

  goBack() {
    this.navCtrl.navigateBack('unitab/others');
  }
}
