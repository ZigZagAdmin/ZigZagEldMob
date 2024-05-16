import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Driver } from 'src/app/models/driver';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.page.html',
  styleUrls: ['./rules.page.scss'],
})
export class RulesPage implements OnInit {
  driver: Driver;
  pageLoading: boolean = false;

  constructor(private navCtrl: NavController, private databaseService: DatabaseService) {}

  async ngOnInit() {
    this.pageLoading = true;
    await firstValueFrom(this.databaseService.getDrivers()).then(res => {
      this.driver = res[0];
      this.pageLoading = false;
    });
  }

  goBack() {
    this.navCtrl.navigateBack('unitab/others');
  }
  getPlatform() {
    return Capacitor.getPlatform();
  }
}
