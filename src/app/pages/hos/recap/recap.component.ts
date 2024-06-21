import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recap',
  templateUrl: './recap.component.html',
  styleUrls: ['./recap.component.scss'],
})
export class RecapComponent  implements OnInit {

  @Input() set recapTime(value: string) {
    this.time = value;
  }

  time: string;
  isModalOpen: boolean = false;

  constructor() { }

  ngOnInit() {}

  open() {
    this.isModalOpen = true;
  }

  cancel() {
    this.isModalOpen = false;
  }

}
