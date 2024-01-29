import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Driver } from 'src/app/models/driver';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  driver: Driver;
  pageLoading: boolean = false;
  timeZone: string = '';

  constructor(private navCtrl: NavController, private databaseService: DatabaseService) {}

  async ngOnInit() {
    this.pageLoading = true;
    let driver$ = firstValueFrom(this.databaseService.getDrivers());
  }

  goBack() {
    this.navCtrl.navigateBack('unitab/others');
  }
}
