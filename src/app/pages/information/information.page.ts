import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}
  onUserManualClick() {
    this.navCtrl.navigateForward('/user-manual');
  }
  onInstructionsClick() {
    this.navCtrl.navigateForward('/instructions');
  }
  goBack() {
    this.navCtrl.navigateBack('unitab/others');
  }
  getPlatform() {
    return Capacitor.getPlatform();
  }
}
