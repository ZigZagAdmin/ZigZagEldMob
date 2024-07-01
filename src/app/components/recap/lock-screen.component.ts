import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss'],
})
export class LockScreenComponent implements OnInit {
  @Input() set isModalOpen(newValue: boolean) {
    this._isModalOpen = newValue;
  }

  @Input() currentStatus: { statusCode: string; statusName: string };
  @Input() circleData: { titleBreak: number; titleShift: number; titleCycle: number; titleDriving: number; percentDriving: number; percentBreak: number; percentShift: number; percentCycle: number };

  @Output() closeCallback: EventEmitter<void> = new EventEmitter<void>();

  constructor(private ngZone: NgZone) {}

  _isModalOpen: boolean = false;

  currentTime: string;
  currentDate: string;

  ngOnInit() {
    this.updateTimeAndDate();
    this.startClock();
  }

  cancel() {
    this._isModalOpen = false;
    this.closeCallback.emit();
  }

  formatDateL(oldDate: string) {
    return formatDate(new Date(oldDate), 'cccc, LLL d', 'en-US');
  }

  getCurrentTime() {
    return formatDate(new Date(), 'h:mm:ss a', 'en-US');
  }

  getCurrentDate() {
    return formatDate(new Date(), 'cccc, d LLLL, yyyy', 'en-US');
  }

  updateTimeAndDate() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
    this.currentDate = now.toLocaleDateString();
  }

  startClock() {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.ngZone.run(() => this.updateTimeAndDate());
      }, 1000);
    });
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
