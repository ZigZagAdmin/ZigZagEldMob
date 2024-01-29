import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Company } from 'src/app/models/company';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.page.html',
  styleUrls: ['./rules.page.scss'],
})
export class RulesPage implements OnInit {
  company: Company;
  pageLoading: boolean = false;

  constructor(private navCtrl: NavController, private databaseService: DatabaseService) {}

  async ngOnInit() {
    this.pageLoading = true;
    await firstValueFrom(this.databaseService.getCompany()).then(res => {
      this.company = res;
      this.pageLoading = false;
    });
  }

  goBack() {
    this.navCtrl.navigateBack('unitab/others');
  }
}
