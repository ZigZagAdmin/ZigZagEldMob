import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss'],
})
export class LockScreenComponent implements OnInit {
  
  @Input() isModalOpen: boolean = false;
  @Input() currentStatus: {statusCode: string; statusName: string;};
  @Input() circleData: {titleBreak: number; titleShift: number; titleCycle: number; titleDriving: number}

  constructor() {}

  ngOnInit() {}

  cancel() {
    this.isModalOpen = false;
  }

  formatDateL(oldDate: string) {
    return formatDate(new Date(oldDate), 'cccc, LLL d', 'en-US');
  }

  getCurrentTime() {
    return formatDate(new Date(), "h:mm:ss a", 'en-US');
  }

  getCurrentDate() {
    return formatDate(new Date(), "cccc, d LLLL, yyyy", 'en-US');
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

  checkElementHasChildren(id: string) {
    let value = document.getElementsByClassName(id).length > 0;
    return value;
  }
}
