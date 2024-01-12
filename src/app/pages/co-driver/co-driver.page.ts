import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-co-driver',
  templateUrl: './co-driver.page.html',
  styleUrls: ['./co-driver.page.scss'],
})
export class CoDriverPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  goBack() {
    this.navCtrl.navigateBack('unitab/others');
  }
}
