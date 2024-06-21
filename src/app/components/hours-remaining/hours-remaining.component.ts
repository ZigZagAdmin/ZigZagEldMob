import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hours-remaining',
  templateUrl: './hours-remaining.component.html',
  styleUrls: ['./hours-remaining.component.scss'],
})
export class HoursRemainingComponent  implements OnInit {

  @Input() percentBreak: number = 0;
  @Input() percentDriving: number = 0;
  @Input() percentShift: number = 0;
  @Input() percentCycle: number = 0;

  @Input() restBreak: number = 0;
  @Input() restShift: number = 0;
  @Input() restCycle: number = 0;

  @Input() progressBreak: number = 0;
  @Input() progressShift: number = 0;
  @Input() progressCycle: number = 0;

  @Input() titleBreak: number = 0;
  @Input() titleDriving: number = 0;
  @Input() titleShift: number = 0;
  @Input() titleCycle: number = 0;

  @Input() animateCircles: boolean = false;

  restMode: boolean = false;

  constructor() { }

  ngOnInit() {}

  toggleRest() {
    this.restMode = !this.restMode;
  }

  convertSecondToHours(secs: number): string {
    let sSign: string;
    let sHours: string;
    let sMinutes: string;

    if (secs < 0) {
      sSign = '-';
      secs = -secs;
    } else {
      sSign = '';
    }

    sHours = (Math.trunc((secs / (60 * 60 * 24)) % 24) * 24 + Math.trunc((secs / (60 * 60)) % 24)).toString();
    sMinutes = (Math.trunc(secs / 60) % 60).toString();

    if (sHours.length === 0) {
      sHours = '00';
    }

    if (sHours.length === 1) {
      sHours = '0' + sHours;
    }

    if (sMinutes.length === 0) {
      sMinutes = '0';
    }

    if (sMinutes.length === 1) {
      sMinutes = '0' + sMinutes;
    }

    return sSign + sHours + ':' + sMinutes;
  }

}
