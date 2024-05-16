import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LogDailies } from 'src/app/models/log-dailies';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.page.html',
  styleUrls: ['./inspection.page.scss'],
})
export class InspectionPage implements OnInit {
  LogDailiesId!: string | null;
  logDailies: LogDailies[] = [];

  databaseSubscription: Subscription | undefined;

  bReady: boolean = false;
  constructor(private navCtrl: NavController, private databaseService: DatabaseService, private router: Router) {}

  ngOnInit() {
    this.databaseSubscription = this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
      if (ready) {
        this.bReady = ready;
        this.databaseService.getLogDailies().subscribe(logDailies => {
          this.logDailies = logDailies;
          this.LogDailiesId = this.logDailies[0].logDailyId;
        });
      }
    });
  }

  onStartInspectionClick() {
    this.navCtrl.navigateForward('/inspection-preview', {
      queryParams: { logId: this.LogDailiesId, page: 'inspection', url: this.router.url },
    });
  }

  onSendLogsClick() {
    this.navCtrl.navigateForward('/send-logs');
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
  }
  getPlatform() {
    return Capacitor.getPlatform();
  }
}
