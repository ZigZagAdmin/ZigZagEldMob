import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-unitab',
  templateUrl: './unitab.page.html',
  styleUrls: ['./unitab.page.scss'],
})
export class UnitabPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  ionViewWillEnter() {
  }

  getPlatform() {
    return Capacitor.getPlatform();
  }
}
