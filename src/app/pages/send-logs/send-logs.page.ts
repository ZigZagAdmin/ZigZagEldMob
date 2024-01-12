import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-send-logs',
  templateUrl: './send-logs.page.html',
  styleUrls: ['./send-logs.page.scss'],
})
export class SendLogsPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  goBack() {
    this.navCtrl.navigateBack('unitab/inspection');
  }
}
