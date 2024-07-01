import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

export enum IdleUserTimes {
  IdleTime = 3000,
  CountdownTime = 5000,
}

@Injectable({
  providedIn: 'root',
})
export class IdleService {
  private timeoutId: any;
  private countdownId: any;
  private countdownValue: number;

  userInactive: Subject<boolean> = new Subject();

  private activityEvents = [
    'mousemove', 'click', 'keypress', 'DOMMouseScroll',
    'mousewheel', 'touchmove', 'MSPointerMove'
  ];

  private eventHandlers: { [key: string]: EventListenerOrEventListenerObject } = {};

  constructor(private ngZone: NgZone) {}

  initListener() {
    this.activityEvents.forEach(eventType => {
      this.eventHandlers[eventType] = this.reset.bind(this);
      window.addEventListener(eventType, this.eventHandlers[eventType]);
    });
  }

  removeListener() {
    this.activityEvents.forEach(eventType => {
      window.removeEventListener(eventType, this.eventHandlers[eventType]);
    });
  }

  reset() {
    clearTimeout(this.timeoutId);
    clearInterval(this.countdownId);
    this.startIdleTimer();
  }

  startIdleTimer() {
    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        this.ngZone.run(() => this.startCountdown());
      }, IdleUserTimes.IdleTime);
    });
  }

  startCountdown() {
    this.countdownValue = IdleUserTimes.CountdownTime / 1000;
    this.ngZone.runOutsideAngular(() => {
      this.countdownId = setInterval(() => {
        this.countdownValue--;
        if (this.countdownValue <= 0) {
          clearInterval(this.countdownId);
          this.ngZone.run(() => this.userInactive.next(true));
        }
      }, 1000);
    });
  }
}
