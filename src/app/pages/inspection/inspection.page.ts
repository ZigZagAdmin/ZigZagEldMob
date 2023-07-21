import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.page.html',
  styleUrls: ['./inspection.page.scss'],
})
export class InspectionPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  onStartInspectionClick() {
    this.navCtrl.navigateForward('/inspection-preview');
  }
  onSendLogsClick() {
    this.navCtrl.navigateForward('/send-logs');
  }
}
