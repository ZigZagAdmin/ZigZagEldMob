import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
import { EventGraphic } from 'src/app/models/event-graphic';
import { ICoDriver, LogDailies } from 'src/app/models/log-dailies';
import { LogEvents } from 'src/app/models/log-histories';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { formatDate } from '@angular/common';
import { NavController, ToastController } from '@ionic/angular';
import { Vehicle } from 'src/app/models/vehicle';
import { Driver } from 'src/app/models/driver';
import { DVIRs } from 'src/app/models/dvirs';
import { ELD } from 'src/app/models/eld';
import { Company } from 'src/app/models/company';
import { UtilityService } from 'src/app/services/utility.service';
import { LocationService } from 'src/app/services/location.service';
import { timeZones } from 'src/app/models/timeZone';

@Component({
  selector: 'app-inspection-preview',
  templateUrl: './inspection-preview.page.html',
  styleUrls: ['./inspection-preview.page.scss'],
})
export class InspectionPreviewPage implements OnInit {
  LogDailiesId: string = '';
  bReady: boolean = false;
  timeZone: string = '';
  vehicle: Vehicle;
  driver: Driver;
  eld: ELD;
  logDailies: LogDailies[] = [];
  logEvents: LogEvents[] = [];
  logDaily: LogDailies;
  currentDay: string = '';
  graphicsHour = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  statusesOnDay: LogEvents[] = [];
  xBgn!: number;
  yBgn!: number;
  xEnd!: number;
  yEnd!: number;
  xBgnV!: number;
  yBgnV!: number;
  eventGraphicLine: EventGraphic[] = [];
  databaseSubscription: Subscription | undefined;
  previousPage!: string | null;
  today = new Date();
  backUrl = '';
  company: Company;
  timeZones: { [key: string]: string } = {};
  currentLogEvents: LogEvents[] = [];

  constructor(private databaseService: DatabaseService, private storage: Storage, private navCtrl: NavController, private route: ActivatedRoute, private utilityService: UtilityService) {}

  async ngOnInit() {
    this.timeZones = this.utilityService.checkSeason();
    let queryParams$ = firstValueFrom(this.route.queryParams);
    let vehicles$ = firstValueFrom(this.databaseService.getVehicles());
    let drivers$ = firstValueFrom(this.databaseService.getDrivers());
    let logDailies$ = firstValueFrom(this.databaseService.getLogDailies());
    let logEvents$ = firstValueFrom(this.databaseService.getLogEvents());
    let elds$ = firstValueFrom(this.databaseService.getELDs());
    let company$ = firstValueFrom(this.databaseService.getCompany());
    let timeZone$ = this.storage.get('timeZone');

    forkJoin([queryParams$, vehicles$, drivers$, logDailies$, logEvents$, elds$, timeZone$, company$]).subscribe(([queryParams, vehicles, drivers, logDailies, logEvents, elds, timeZone, company]) => {
      this.backUrl = queryParams['url'];
      this.LogDailiesId = queryParams['logId'];
      this.previousPage = queryParams['page'];
      this.vehicle = vehicles[0];
      this.driver = drivers[0];
      this.timeZone = timeZone;
      this.eld = elds.find(eld => eld.vehicleId === this.vehicle.vehicleId);
      this.logDailies = logDailies.slice(0, 8);
      this.logDaily = this.logDailies.find(item => item.logDailyId === this.LogDailiesId);
      this.logEvents = logEvents;
      this.company = company;
      this.drawGraph();
    });
  }

  getDateSub(date: string) {
    let _date = formatDate(date, 'EEEE, MMM d', 'en_US');
    let _today = formatDate(new Date(), 'EEEE, MMM d', 'en_US');
    return _date === _today ? _date + ' (Today)' : _date;
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

    this.currentDay = this.logDaily?.logDate;

    let logDateIndex = this.logDailies.findIndex(el => el.logDailyId === this.logDaily.logDailyId);
    this.currentLogEvents = [];
    this.logEvents.forEach((logEvent: LogEvents) => {
      if (
        new Date(this.logDaily.logDate).getTime() === new Date(formatDate(logEvent.eventTime.timeStamp, 'yyyy/LL/d', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones])).getTime()
      ) {
        this.currentLogEvents.push(logEvent);
      }
    });

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
              break;

            case 'SB':
              this.yBgn = 75;
              this.yEnd = 75;
              break;

            case 'D':
              this.yBgn = 125;
              this.yEnd = 125;
              break;

            case 'ON':
            case 'YM':
              this.yBgn = 175;
              this.yEnd = 175;
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

    this.currentLogEvents.unshift(this.statusesOnDay[0]);
  }

  goToNextLog() {
    const currentIndex = this.logDailies.findIndex(item => item.logDailyId === this.logDaily?.logDailyId);
    const nextIndex = currentIndex + 1;

    if (nextIndex < this.logDailies.length) {
      this.logDaily = this.logDailies[nextIndex];
      this.drawGraph();
    }
  }

  goToPreviousLog() {
    const currentIndex = this.logDailies.findIndex(item => item.logDailyId === this.logDaily?.logDailyId);
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      this.logDaily = this.logDailies[previousIndex];
      this.drawGraph();
    }
  }

  isCoDriverPresent() {
    return !!this.logDaily?.form?.coDriver && Object.keys(this.logDaily?.form?.coDriver).length !== 0 && this.logDaily?.form?.coDriver.driverId !== '00000000-0000-0000-0000-000000000000';
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
  }

  getStatusColor(status: string) {
    if (status) {
      let colorObj = {
        OFF: 'var(--gray-300)',
        SB: 'var(--gray-500)',
        ON: 'var(--warning-400)',
        D: 'var(--success-500)',
        PC: 'var(--gray-300)',
        YM: 'var(--warning-400)',
      };
      return colorObj[status as keyof typeof colorObj];
    }
    return 'var(--success-500)';
  }

  logEventDuration(logStatus: LogEvents) {
    return this.utilityService.msToTime(
      logStatus.eventTime.timeStampEnd !== undefined && logStatus.eventTime.timeStampEnd !== 0
        ? logStatus.eventTime.timeStampEnd - logStatus.eventTime.timeStamp
        : new Date().getTime() - logStatus.eventTime.timeStamp
    );
  }

  goBack() {
    if (this.backUrl === 'log-item') this.navCtrl.navigateBack(['log-item', this.logDaily.logDailyId]);
    else this.navCtrl.navigateBack('unitab/inspection');
  }
}
