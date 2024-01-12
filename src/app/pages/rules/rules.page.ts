import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.page.html',
  styleUrls: ['./rules.page.scss'],
})
export class RulesPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.navigateBack('unitab/others')
  }

}
