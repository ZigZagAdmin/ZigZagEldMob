import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public segment: string = "list";
  public arr = new Array(25);

  constructor() {}

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }
}
