import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unitab',
  templateUrl: './unitab.page.html',
  styleUrls: ['./unitab.page.scss'],
})
export class UnitabPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  ionViewWillEnter() {
    // Код, который должен выполняться при каждом отображении UnitabPage
    console.log('ionViewWillEnter - UnitabPage');
    // Здесь вы можете обновить данные или выполнить другие действия при возвращении с EditDvirPage
    // Например, обновить список DVIRs
  }
}
