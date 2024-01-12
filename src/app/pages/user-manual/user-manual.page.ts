import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-manual',
  templateUrl: './user-manual.page.html',
  styleUrls: ['./user-manual.page.scss'],
})
export class UserManualPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  goBack() {
    this.navCtrl.navigateBack('/information');
  }
}
