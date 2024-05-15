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
import { Driver, IAssignedVehicle } from 'src/app/models/driver';
import { DVIRs } from 'src/app/models/dvirs';
import { ELD } from 'src/app/models/eld';
import { Company } from 'src/app/models/company';
import { UtilityService } from 'src/app/services/utility.service';
import { LocationService } from 'src/app/services/location.service';
import { timeZones } from 'src/app/models/timeZone';
import { TranslateService } from '@ngx-translate/core';

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

  durationsOFF = 0;
  durationsSB = 0;
  durationsD = 0;
  durationsON = 0;

  unindentifiedDrivingRecords: string = '';
  dataDaigIndicators: string = '';
  deviceMalfIndicators: string = '';

  logEventsVehicles: { vehicle: Partial<Vehicle>; odomoter: string; distance: number; engineHours: string }[] = [];

  pageLoading: boolean = false;

  constructor(private databaseService: DatabaseService, private storage: Storage, private navCtrl: NavController, private route: ActivatedRoute, private utilityService: UtilityService, private translate: TranslateService) {}

  async ngOnInit() {
    this.pageLoading = true;
    this.timeZone = await this.storage.get('timeZone');
    this.timeZones = this.utilityService.checkSeason();
    await firstValueFrom(this.route.queryParams).then((queryParams) => {
      this.backUrl = queryParams['url'];
      this.LogDailiesId = queryParams['logId'];
      this.previousPage = queryParams['page'];
    });
    this.company = await firstValueFrom(this.databaseService.getCompany()); 
  }

  async ionViewDidEnter() {
    let vehicles$ = firstValueFrom(this.databaseService.getVehicles());
    let drivers$ = firstValueFrom(this.databaseService.getDrivers());
    let logDailies$ = firstValueFrom(this.databaseService.getLogDailies());
    let logEvents$ = firstValueFrom(this.databaseService.getLogEvents());
    let elds$ = firstValueFrom(this.databaseService.getELDs());
    

    forkJoin([vehicles$, drivers$, logDailies$, logEvents$, elds$]).subscribe(([vehicles, drivers, logDailies, logEvents, elds]) => {
      this.vehicle = vehicles[0];
      this.driver = drivers[0];
      this.eld = elds.find(eld => eld.vehicleId === this.vehicle.vehicleId);
      this.logDailies = logDailies.slice(0, 8);
      this.logDaily = this.logDailies.find(item => item.logDailyId === this.LogDailiesId);
      this.logEvents = logEvents;
      this.drawGraph();
      this.pageLoading = false;
    });
  }

  getDateSub(date: string) {
    let date_ = this.translate.instant(formatDate(date, 'EEEE', 'en_US')) + ', ' + this.translate.instant(formatDate(date, 'MMM', 'en_US')) + ' ' + this.translate.instant(formatDate(date, 'd', 'en_US'));
    let today_ = this.translate.instant(formatDate(new Date(), 'EEEE', 'en_US')) + ', ' + this.translate.instant(formatDate(new Date(), 'MMM', 'en_US')) + ' ' + this.translate.instant(formatDate(new Date(), 'd', 'en_US'));
    return date_ === today_ ? date_ + ' (' + this.translate.instant('Today') + ')' : date_;
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

        dateBgn = new Date(formatDate(new Date(event.eventTime.timeStamp), 'yyyy-MM-ddTHH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]));
        dateEnd = new Date(formatDate(new Date(sDateEnd), 'yyyy-MM-ddTHH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]));

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

    this.currentLogEvents.unshift(this.statusesOnDay[0]);
    this.getVehiclesFromLogEvents();
    this.findUDRandDDIandDMI();
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

  dateWithTimeZone(date: number, format: string) {
    return formatDate(new Date(date), format, 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]);
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
  }

  getVehiclesFromLogEvents() {
    this.logEventsVehicles = [];
    this.currentLogEvents.forEach(logEvent => {
      if (!this.logEventsVehicles.some(item => item.vehicle.vehicleId === logEvent.vehicle.vehicleId)) {
        this.logEventsVehicles.push({ vehicle: logEvent.vehicle, odomoter: '', distance: 0, engineHours: '' });
      }
    });
    this.logEventsVehicles.forEach(vehicle => {
      let odometer: number[] = [];
      let engineHours: number[] = [];
      this.currentLogEvents.forEach(logEvent => {
        if (logEvent.vehicle.vehicleId === vehicle.vehicle.vehicleId) {
          if (logEvent.odometer && logEvent.odometer !== 0) odometer.push(logEvent.odometer);
          if (logEvent.engineHours && logEvent.engineHours !== 0) engineHours.push(logEvent.engineHours);
        }
      });
      if (odometer.length !== 0) {
        vehicle.odomoter = Math.min(...odometer) + ' - ' + Math.max(...odometer);
        vehicle.distance = Math.max(...odometer) - Math.min(...odometer);
      } else {
        vehicle.odomoter = '0 - 0';
        vehicle.distance = 0;
      }
      if (engineHours.length !== 0) {
        vehicle.engineHours = Math.min(...engineHours) + ' - ' + Math.max(...engineHours);
      } else {
        vehicle.engineHours = '0 - 0';
      }
    });
  }

  findUDRandDDIandDMI() {
    this.unindentifiedDrivingRecords = 'No';
    this.dataDaigIndicators = 'No';
    this.deviceMalfIndicators = 'No';
    this.currentLogEvents.forEach(logEvent => {
      switch (logEvent.type.code) {
        case 'UNIDENTIFIED_DRIVER':
          this.unindentifiedDrivingRecords = 'Yes';
          break;
        case 'EVT_LOGGED':
        case 'EVT_CLEARED':
          this.dataDaigIndicators = 'Yes';
          break;
        case 'ERR_LOGGED':
        case 'ERR_CLEARED':
          this.deviceMalfIndicators = 'Yes';
          break;
      }
    });
  }

  goBack() {
    if (this.backUrl === 'log-item') this.navCtrl.navigateBack(['log-item', this.logDaily.logDailyId]);
    else this.navCtrl.navigateBack('unitab/inspection');
  }
}
