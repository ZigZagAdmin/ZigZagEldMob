import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LogDailies } from 'src/app/models/log-dailies';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription } from 'rxjs';

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
  constructor(
    private navCtrl: NavController,
    private databaseService: DatabaseService
  ) {}

  ngOnInit() {
    this.databaseSubscription =
      this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
        if (ready) {
          this.bReady = ready;
          this.databaseService.getLogDailies().subscribe((logDailies) => {
            this.logDailies = logDailies;
            this.LogDailiesId =
              this.logDailies[this.logDailies.length - 1].LogDailiesId;
            console.log(this.LogDailiesId);
          });
        }
      });
  }

  onStartInspectionClick() {
    this.navCtrl.navigateForward('/inspection-preview');
  }
  onSendLogsClick() {
    this.navCtrl.navigateForward('/send-logs');
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
  }
}
