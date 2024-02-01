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

@Component({
  selector: 'app-inspection-preview',
  templateUrl: './inspection-preview.page.html',
  styleUrls: ['./inspection-preview.page.scss'],
})
export class InspectionPreviewPage implements OnInit {
  LogDailiesId: string = '';
  bReady: boolean = false;
  TimeZoneCity: string = '';
  vehicle: Vehicle;
  driver: Driver;
  eld: ELD;
  coDriver: ICoDriver;
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

  constructor(
    private databaseService: DatabaseService,
    private storage: Storage,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    let queryParams$ = firstValueFrom(this.route.queryParams);
    let vehicles$ = firstValueFrom(this.databaseService.getVehicles());
    let drivers$ = firstValueFrom(this.databaseService.getDrivers());
    let logDailies$ = firstValueFrom(this.databaseService.getLogDailies());
    let logEvents$ = firstValueFrom(this.databaseService.getLogEvents());
    let elds$ = firstValueFrom(this.databaseService.getELDs());
    let coDriver$ = this.storage.get('coDriver');
    let timeZone$ = this.storage.get('TimeZoneCity');

    forkJoin([queryParams$, vehicles$, drivers$, logDailies$, logEvents$, elds$, coDriver$, timeZone$]).subscribe(([queryParams, vehicles, drivers, logDailies, logEvents, elds, coDriver, timeZone]) => {
      this.backUrl = queryParams['url'];
      this.LogDailiesId = queryParams['logId'];
      this.previousPage = queryParams['page'];
      this.vehicle = vehicles[0];
      this.driver = drivers[0];
      this.coDriver = coDriver;
      this.TimeZoneCity = timeZone;
      this.eld =elds.find(eld => eld.vehicleId === this.vehicle.vehicleId);
      this.logDailies = logDailies.slice(0, 8);
      this.logDaily = this.logDailies.find(item => item.logDailyId === this.LogDailiesId);
      this.logEvents = logEvents;
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
    let sDateEnd = '';
    this.xBgn = 0;
    this.xEnd = 0;
    this.xBgnV = 0;
    this.yBgnV = 0;

    this.currentDay = this.logDaily?.logDate;

    this.logEvents.forEach(event => {
      if (allSt.includes(event.type.code)) {
        console.log(event.eventTime.timeStampEnd);
        if (event.eventTime.timeStampEnd) sDateEnd = new Date(event.eventTime.timeStampEnd).toISOString();
        else sDateEnd = new Date().toISOString();
        if (sDateEnd == '0001-01-01T00:00:00') {
          sDateEnd = formatDate(
            new Date().toLocaleString('en-US', {
              timeZone: this.TimeZoneCity,
            }),
            'yyyy-MM-ddTHH:mm:ss',
            'en_US'
          );
        }

        if (
          formatDate(new Date(event.eventTime.timeStamp), 'yyyy-MM-dd', 'en_US') <= formatDate(new Date(this.currentDay as string), 'yyyy-MM-dd', 'en_US') &&
          formatDate(new Date(this.currentDay as string), 'yyyy-MM-dd', 'en_US') <= formatDate(new Date(sDateEnd), 'yyyy-MM-dd', 'en_US')
        ) {
          console.log('event', event);

          dateBgn = new Date(event.eventTime.timeStamp);
          console.log(dateBgn.toLocaleDateString());
          console.log(new Date(this.currentDay as string).toLocaleDateString());
          if (dateBgn.toLocaleDateString() === new Date(this.currentDay as string).toLocaleDateString()) {
            this.xBgn = dateBgn.getHours() * 60 + dateBgn.getMinutes();
          } else {
            this.xBgn = 0;
          }

          console.log('X BEGIN =', this.xBgn);

          dateEnd = new Date(sDateEnd);

          if (dateEnd.toLocaleDateString() === new Date(this.currentDay as string).toLocaleDateString()) {
            this.xEnd = dateEnd.getHours() * 60 + dateEnd.getMinutes();
          } else {
            this.xEnd = 1440;
          }
          console.log('X END =', this.xEnd);

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
    return Object.keys(this.coDriver).length !== 0;
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
  }

  goBack() {
    console.log(this.backUrl);
    if (this.backUrl === 'log-item') this.navCtrl.navigateBack(['log-item', this.logDaily.logDailyId]);
    else this.navCtrl.navigateBack('unitab/inspection');
  }
}
