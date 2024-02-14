import { formatDate } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
import { EventGraphic } from 'src/app/models/event-graphic';
import { LogDailies } from 'src/app/models/log-dailies';
import { LogEvents } from 'src/app/models/log-histories';
import { DatabaseService } from 'src/app/services/database.service';
import { ShareService } from 'src/app/services/share.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-edit-duty-status',
  templateUrl: './edit-duty-status.page.html',
  styleUrls: ['./edit-duty-status.page.scss'],
})
export class EditDutyStatusPage implements OnInit, OnDestroy {
  urlSubscription: Subscription;
  selectedButton: string = '';
  currentStatus: string = '';
  location: string;
  comments: string;
  currentDay: string = '';
  logDaily: LogDailies;
  logDailies: LogDailies[] = [];
  logDailyId: string;

  statusesOnDay: LogEvents[] = [];
  xBgn: number;
  yBgn: number;
  xEnd: number;
  yEnd: number;
  xBgnV: number;
  yBgnV: number;
  logEvents: LogEvents[] = [];
  logEvent: LogEvents;

  isConfirmButtonActive: boolean = false;

  graphicsHour = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  eventGraphicLine: EventGraphic[] = [];

  pageLoading: boolean = false;

  timeZones: { [key: string]: string } = {};
  timeZone: string = '';

  durationsOFF = 0;
  durationsSB = 0;
  durationsD = 0;
  durationsON = 0;

  duration: number = 0;

  validation = {
    startTime: false,
    endTime: false,
    location: false,
  };

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private utilityService: UtilityService,
    private storage: Storage,
    private databaseService: DatabaseService,
    private toastService: ToastService,
    private shareService: ShareService
  ) {}

  ngOnInit() {
    this.pageLoading = true;
    this.timeZones = this.utilityService.checkSeason();
    let logDailies$ = firstValueFrom(this.databaseService.getLogDailies());
    let logEvents$ = firstValueFrom(this.databaseService.getLogEvents());
    let queryParams$ = firstValueFrom(this.route.queryParams);
    let timeZone$ = this.storage.get('timeZone');

    forkJoin([queryParams$, timeZone$, logDailies$, logEvents$]).subscribe(([queryParams, timeZone, logDailies, logEvents]) => {
      this.timeZone = timeZone;
      this.logDailies = logDailies;
      this.logDailyId = queryParams['logDailyId'];
      this.logDaily = this.logDailies.find(logDaily => logDaily.logDailyId === queryParams['logDailyId']);
      this.logEvents = logEvents;
      this.logEvent = this.logEvents.find(logEvent => logEvent.logEventId === queryParams['logEventId']);
      this.calculateDuration();
      this.currentStatus = this.logEvent.type.code;
      this.selectButton(this.logEvent.type.code);
      this.drawGraph();
      this.pageLoading = false;
    });
  }

  ngOnDestroy(): void {}

  goBack() {
    this.navCtrl.navigateBack(['log-item', this.logDailyId]);
  }

  drawGraph() {
    const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];
    this.eventGraphicLine = [];
    this.statusesOnDay = [];
    let dateBgn = null;
    let dateEnd = null;
    let sDateEnd: any = '';
    this.xBgn = 0;
    this.xEnd = 0;
    this.xBgnV = 0;
    this.yBgnV = 0;

    this.durationsOFF = 0;
    this.durationsSB = 0;
    this.durationsD = 0;
    this.durationsON = 0;

    this.currentDay = this.logDaily?.logDate;

    this.logEvents.forEach(event => {
      if (allSt.includes(event.type.code)) {
        if (event.eventTime.timeStampEnd) sDateEnd = new Date(event.eventTime.timeStampEnd);
        else sDateEnd = new Date().getTime();

        dateBgn = new Date(formatDate(new Date(event.eventTime.timeStamp), 'yyyy-MM-dd HH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]));
        dateEnd = new Date(formatDate(new Date(sDateEnd), 'yyyy-MM-dd HH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]));

        if (
          formatDate(new Date(event.eventTime.timeStamp), 'yyyy-MM-dd', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]) <=
            formatDate(new Date(this.currentDay), 'yyyy-MM-dd', 'en_US') &&
          formatDate(new Date(this.currentDay), 'yyyy-MM-dd', 'en_US') <= formatDate(new Date(sDateEnd), 'yyyy-MM-dd', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones])
        ) {
          if (dateBgn.toLocaleDateString() === new Date(this.currentDay as string).toLocaleDateString()) {
            this.xBgn = dateBgn.getHours() * 60 + dateBgn.getMinutes();
          } else {
            this.xBgn = 0;
          }

          if (dateEnd.toLocaleDateString() === new Date(this.currentDay as string).toLocaleDateString()) {
            this.xEnd = dateEnd.getHours() * 60 + dateEnd.getMinutes();
          } else {
            this.xEnd = 1440;
          }

          switch (event.type.code) {
            case 'OFF':
            case 'PC':
              this.yBgn = 25;
              this.yEnd = 25;
              this.durationsOFF += this.xEnd - this.xBgn;
              break;

            case 'SB':
              this.yBgn = 75;
              this.yEnd = 75;
              this.durationsSB += this.xEnd - this.xBgn;
              break;

            case 'D':
              this.yBgn = 125;
              this.yEnd = 125;
              this.durationsD += this.xEnd - this.xBgn;
              break;

            case 'ON':
            case 'YM':
              this.yBgn = 175;
              this.yEnd = 175;
              this.durationsON += this.xEnd - this.xBgn;
              break;
          }

          switch (event.type.code) {
            case 'OFF':
              this.eventGraphicLine.push({
                x1: this.xBgn,
                y1: this.yBgn,
                x2: this.xEnd,
                y2: this.yEnd,
                yV: this.yBgnV,
                class: 'eventStatusOFF',
                name: '',
                historyId: event.logEventId,
                status: 0,
                statusClick: 0,
              });
              break;

            case 'SB':
              this.eventGraphicLine.push({
                x1: this.xBgn,
                y1: this.yBgn,
                x2: this.xEnd,
                y2: this.yEnd,
                yV: this.yBgnV,
                class: 'eventStatusSB',
                name: '',
                historyId: event.logEventId,
                status: 0,
                statusClick: 0,
              });
              break;

            case 'D':
              this.eventGraphicLine.push({
                x1: this.xBgn,
                y1: this.yBgn,
                x2: this.xEnd,
                y2: this.yEnd,
                yV: this.yBgnV,
                class: 'eventStatusD',
                name: '',
                historyId: event.logEventId,
                status: 0,
                statusClick: 0,
              });
              break;

            case 'ON':
              this.eventGraphicLine.push({
                x1: this.xBgn,
                y1: this.yBgn,
                x2: this.xEnd,
                y2: this.yEnd,
                yV: this.yBgnV,
                class: 'eventStatusON',
                name: '',
                historyId: event.logEventId,
                status: 0,
                statusClick: 0,
              });
              break;

            case 'PC':
              this.eventGraphicLine.push({
                x1: this.xBgn,
                y1: this.yBgn,
                x2: this.xEnd,
                y2: this.yEnd,
                yV: this.yBgnV,
                class: 'eventStatusPC',
                name: '',
                historyId: event.logEventId,
                status: 0,
                statusClick: 0,
              });
              break;

            case 'YM':
              this.eventGraphicLine.push({
                x1: this.xBgn,
                y1: this.yBgn,
                x2: this.xEnd,
                y2: this.yEnd,
                yV: this.yBgnV,
                class: 'eventStatusYM',
                name: '',
                historyId: event.logEventId,
                status: 0,
                statusClick: 0,
              });
              break;
          }

          this.xBgnV = this.xEnd;
          this.yBgnV = this.yEnd;
          this.statusesOnDay.push(event);
        }
      }
    });
  }

  save() {}

  getNewStartDate(date: number) {
    const minPeriod = 60000;

    if (!this.logEvent.eventTime.timeStampEnd || (this.logEvent.eventTime.timeStampEnd && this.logEvent.eventTime.timeStampEnd === 0)) this.logEvent.eventTime.timeStampEnd = new Date().getTime();

    if (date > this.logEvent.eventTime.timeStampEnd + minPeriod) {
      this.toastService.showToast('Log Start Time cannot be bigger than End Time');
    }

    const leftOrRight: boolean = this.logEvent.eventTime.timeStamp - date > 0 ? false : true; // left = false, right = true

    let index = this.statusesOnDay.findIndex(el => el.logEventId === this.logEvent.logEventId);

    if (!leftOrRight) {
      if (date - this.statusesOnDay[index - 1].eventTime.timeStamp <= minPeriod) {
        this.toastService.showToast('Previous log event must be at least 1 minute long');
      }
      this.logEvent.eventTime.timeStamp = date;
      this.statusesOnDay[index].eventTime.timeStamp = date;
      this.statusesOnDay[index - 1].eventTime.timeStampEnd = date;
      this.calculateDuration();
    } else {
      if (this.statusesOnDay[index + 1]) {
        if (this.statusesOnDay[index + 1].eventTime.timeStamp - date <= minPeriod) {
          this.toastService.showToast('Current log event must be at least 1 minute long');
        }
        this.logEvent.eventTime.timeStamp = date;
        this.statusesOnDay[index].eventTime.timeStamp = date;
        this.statusesOnDay[index - 1].eventTime.timeStampEnd = date;
        this.calculateDuration();
      } else {
        if (new Date().getTime() - date <= minPeriod) {
          this.toastService.showToast('Current log event must be at least 1 minute long');
        }
        this.logEvent.eventTime.timeStamp = date;
        this.statusesOnDay[index].eventTime.timeStamp = date;
        this.statusesOnDay[index - 1].eventTime.timeStampEnd = date;
        this.calculateDuration();
      }
    }
    this.logEvents.forEach(el => this.statusesOnDay.forEach(status => (el.logEventId === status.logEventId ? (el = status) : null)));
    this.drawGraph();
  }

  calculateDuration() {
    if (!this.logEvent.eventTime.timeStampEnd || (this.logEvent.eventTime.timeStampEnd && this.logEvent.eventTime.timeStampEnd === 0)) {
      this.duration = new Date().getTime() - this.logEvent.eventTime.timeStamp;
      console.log(this.duration);
    } else {
      this.duration = this.logEvent.eventTime.timeStampEnd - this.logEvent.eventTime.timeStamp;
    }
  }

  selectButton(button: string) {
    this.selectedButton = button;
    this.logEvent.type.code = button;
    let index = this.logEvents.findIndex(el => el.logEventId === this.logEvent.logEventId);
    this.logEvents[index] = this.logEvent;
    this.drawGraph();
  }
  getCurrentDateFormat(value: string) {
    return '(' + formatDate(value, 'LLLL d', 'en_US') + ')';
  }
}
