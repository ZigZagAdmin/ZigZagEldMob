import { formatDate } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
import { EventGraphic } from 'src/app/models/event-graphic';
import { LogDailies } from 'src/app/models/log-dailies';
import { LogEvents } from 'src/app/models/log-histories';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DatabaseService } from 'src/app/services/database.service';
import { LocationService } from 'src/app/services/location.service';
import { ShareService } from 'src/app/services/share.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilityService } from 'src/app/services/utility.service';
import { hosErrors } from 'src/app/utilities/hos-errors';

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
  _statusesOnDay: LogEvents[] = [];
  oldStatusesOnDay: LogEvents[] = [];
  xBgn: number;
  yBgn: number;
  xEnd: number;
  yEnd: number;
  xBgnV: number;
  yBgnV: number;
  logEvents: LogEvents[] = [];
  logEvent: LogEvents;
  oldLogEvent: LogEvents;

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
    startTime: true,
    location: false,
    comments: false,
  };

  noValidation = false;

  disableForm = {
    timeInput: false,
    status: false,
    location: false,
  };

  onInitExec: boolean = true;

  currentLogEventRect = {
    x1: 0,
    x2: 0,
  };

  minValue: string = '';
  minValueNumber: number = 0;
  maxValue: string = '';
  maxValueNumber: number = 0;

  timeZoneDifference: number = 0;

  loading: boolean = false;

  locationLoading: boolean = false;
  locationDisable: boolean = false;

  splitSleeperBerth: boolean;
  violations: any = {};
  splitSleepData: { duration: number; drivingT: number; time: number };
  bResetTimeLast7Day: boolean;
  newShift = 36000000; // 10 часов
  driveLimit = 39540000 + 60000; // 11 часов
  shiftLimit = 50400000; // 14 часов
  cycleLimit = 252000000; // 70 часов
  driveWithoutBreakLimit = 28800000; // 8 часов
  restartTime = 122400000; // 34 часа
  notDriveLimit = 30 * 60 * 1000; // 30min
  inspectionTime = 691200000; // 8 дней

  violationRect = {
    x1: 0,
    x2: 0,
  };

  dutyStatuses: { label: string; value: string }[] = [
    { label: 'Off Duty', value: 'OFF' },
    { label: 'Sleeper Berth', value: 'SB' },
    { label: 'On Duty', value: 'ON' },
    { label: 'Driving', value: 'D' },
    { label: 'Personal Conveyance', value: 'PC' },
    { label: 'Yard Moves', value: 'YM' },
  ];

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private utilityService: UtilityService,
    private storage: Storage,
    private databaseService: DatabaseService,
    private toastService: ToastService,
    private shareService: ShareService,
    private dashboardService: DashboardService,
    private locationService: LocationService
  ) {}

  async ngOnInit() {
    this.pageLoading = true;
    this.timeZones = this.utilityService.checkSeason();
    let logDailies$ = firstValueFrom(this.databaseService.getLogDailies());
    let logEvents$ = firstValueFrom(this.databaseService.getLogEvents());
    let queryParams$ = firstValueFrom(this.route.queryParams);
    let timeZone$ = this.storage.get('timeZone');
    let splitSleeperBerth$ = this.storage.get('splitSleeperBerth');

    forkJoin([queryParams$, timeZone$, logDailies$, logEvents$, splitSleeperBerth$]).subscribe(([queryParams, timeZone, logDailies, logEvents, splitSleeperBerth]) => {
      this.timeZone = timeZone;
      this.splitSleeperBerth = splitSleeperBerth;
      this.logDailies = logDailies;
      this.logDailyId = queryParams['logDailyId'];
      this.logDaily = this.logDailies.find(logDaily => logDaily.logDailyId === queryParams['logDailyId']);
      this.violations[this.logDaily.logDate] = JSON.parse(JSON.stringify(this.logDaily.violations));
      this.logEvents = logEvents;
      this.logEvent = this.logEvents.find(logEvent => logEvent.logEventId === queryParams['logEventId']);
      this.calculateDuration();
      this.calculateTimeZoneDifference();
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

  async getLocalCurrentLocation() {
    this.locationLoading = true;
    let locationStatus = await this.storage.get('locationStatus');
    if (Capacitor.getPlatform() !== 'web') {
      if (!locationStatus) {
        this.toastService.showToast('Problems fetching location! Check the location service!', 'danger', 2500);
      }
    }
    await this.locationService.getCurrentLocation().then(res => {
      let oldLocation = this.logEvent.location;
      this.logEvent.location = res;
      this.locationLoading = false;
      if (this.logEvent.location.locationType === 'AUTOMATIC') {
        this.locationDisable = true;
      } else {
        this.locationDisable = false;
        this.logEvent.location = oldLocation;
      }
    });
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
    this._statusesOnDay = JSON.parse(JSON.stringify(this.statusesOnDay));
    this.displayCurrentLogEventRect();
    if (this.onInitExec) {
      this.disableWhenDrivingFromELD();
      this.calculateMinAndMaxValues();
      this.onInitExec = false;
    }
    if (!this.validation.startTime) {
      this._statusesOnDay = JSON.parse(JSON.stringify(this.oldStatusesOnDay));
      this.logEvent = JSON.parse(JSON.stringify(this.oldLogEvent));
    } else {
      this.oldStatusesOnDay = JSON.parse(JSON.stringify(this._statusesOnDay));
      this.oldLogEvent = JSON.parse(JSON.stringify(this.logEvent));
    }
  }

  async save() {
    // if(this.violations[this.logDaily.logDate] && this.violations[this.logDaily.logDate].length !== 0) {
    //   this.toastService.showToast('Please resolve the violations before saving!');
    //   return;
    // }
    this.logDaily.violations = this.violations[this.logDaily.logDate] ? JSON.parse(JSON.stringify(this.violations[this.logDaily.logDate])) : [];
    this.noValidation = false;
    if (!this.validation.startTime) {
      this.toastService.showToast('Start Time not valid!');
      return;
    }
    if (this.logEvent.location.description && this.logEvent.location.description.length !== 0) this.validation.location = true;
    if (this.logEvent.comment && this.logEvent.comment.length !== 0) this.validation.comments = true;
    this.shareService.changeMessage(this.utilityService.generateString(5));
    console.log(this.validation);
    if (!this.utilityService.validateForm(this.validation)) return;

    this.loading = true;

    let index = this._statusesOnDay.findIndex(el => el.logEventId === this.logEvent.logEventId);
    let index2 = this.logDailies.findIndex(el => el.logDailyId === this.logDaily.logDailyId);
    if (index === this._statusesOnDay.length - 1 && index2 === this.logDailies.length - 1) this.logEvent.eventTime.timeStampEnd = undefined;

    await this.updateLogDailies(this.logDaily);

    if ((await Network.getStatus()).connected) {
      await this.dashboardService
        .updateLogEvent(this.logEvent)
        .toPromise()
        .then(async response => {
          console.log('Last LogEvent is updated on server:', response);
          await this.updateIndexLogEvents(this.logEvent, true);
          // this.loading = false;
          // this.goBack();
        })
        .catch(async error => {
          console.log('Last LogEvent Pushed in offline logEvents array');
          await this.updateIndexLogEvents(this.logEvent, false);
          // this.loading = false;
          // this.goBack();
        });
      await this.dashboardService
        .updateLogEvent(this._statusesOnDay[index - 1])
        .toPromise()
        .then(async response => {
          console.log('Last LogEvent is updated on server:', response);
          await this.updateIndexLogEvents(this._statusesOnDay[index - 1], true);
          this.loading = false;
          this.goBack();
        })
        .catch(async error => {
          console.log('Last LogEvent Pushed in offline logEvents array');
          await this.updateIndexLogEvents(this._statusesOnDay[index - 1], false);
          this.loading = false;
          this.goBack();
        });
    } else {
      console.log('Updated logEvents in offline array');
      await this.updateIndexLogEvents(this.logEvent, false);
      await this.updateIndexLogEvents(this._statusesOnDay[index - 1], false);
      this.loading = false;
      this.goBack();
    }
  }

  async updateLogEvents(logEventData: LogEvents, online: boolean) {
    logEventData.sent = online;
    this.logEvents.push(logEventData);
    await this.storage.set('logEvents', this.logEvents);
  }

  async updateIndexLogEvents(logEventData: LogEvents, online: boolean) {
    logEventData.sent = online;
    const index = this.logEvents.findIndex(item => item.logEventId === logEventData.logEventId);
    if (index !== -1) {
      this.logEvents[index] = logEventData;
    }
    await this.storage.set('logEvents', this.logEvents);
  }

  async getNewStartDate(date: number) {
    this.clearRect();
    const minPeriod = 60000;

    if (!this.logEvent.eventTime.timeStampEnd || (this.logEvent.eventTime.timeStampEnd && this.logEvent.eventTime.timeStampEnd === 0)) this.logEvent.eventTime.timeStampEnd = new Date().getTime();

    if (date > this.logEvent.eventTime.timeStampEnd + minPeriod) {
      this.toastService.showToast('Log Start Time cannot be bigger than End Time', 'danger', 3000);
    }

    const leftOrRight: boolean = this.logEvent.eventTime.timeStamp - date > 0 ? false : true; // left = false, right = true

    let index = this._statusesOnDay.findIndex(el => el.logEventId === this.logEvent.logEventId);

    if (!leftOrRight) {
      if (index - 1 === 0) {
        if (date - this.minValueNumber <= minPeriod) {
          this.validation.startTime = false;
          this.invalidate();
          this.toastService.showToast('First log event of the day must be at least 1 minute long', 'danger', 2500);
        } else {
          this.validation.startTime = true;
          this.validate();
        }
      } else {
        if (date - this._statusesOnDay[index - 1].eventTime.timeStamp <= minPeriod) {
          this.validation.startTime = false;
          this.invalidate();
          this.toastService.showToast('Previous log event must be at least 1 minute long', 'danger', 2500);
        } else {
          this.validation.startTime = true;
          this.validate();
        }
      }
      this.logEvent.eventTime.timeStamp = date;
      this._statusesOnDay[index].eventTime.timeStamp = date;
      this._statusesOnDay[index - 1].eventTime.timeStampEnd = date;
      this.calculateDuration();
    } else {
      if (index === this._statusesOnDay.length - 1) {
        if (this.maxValueNumber - date <= minPeriod) {
          this.validation.startTime = false;
          this.invalidate();
          this.toastService.showToast('Last log event must be at least 1 minute long', 'danger', 2500);
        } else {
          this.validation.startTime = true;
          this.validate();
        }
        this.logEvent.eventTime.timeStamp = date;
        this._statusesOnDay[index].eventTime.timeStamp = date;
        this._statusesOnDay[index - 1].eventTime.timeStampEnd = date;
        this.calculateDuration();
      } else {
        if (new Date().getTime() - date <= minPeriod) {
          this.validation.startTime = false;
          this.invalidate();
          this.toastService.showToast('Current log event must be at least 1 minute long', 'danger', 2500);
        } else {
          this.validation.startTime = true;
          this.validate();
        }
        this.logEvent.eventTime.timeStamp = date;
        this._statusesOnDay[index].eventTime.timeStamp = date;
        this._statusesOnDay[index - 1].eventTime.timeStampEnd = date;
        this.calculateDuration();
      }
    }
    this.logEvents = this.logEvents.map(el => {
      const index = this._statusesOnDay.findIndex(status => el.logEventId === status.logEventId);
      return index === -1 ? el : JSON.parse(JSON.stringify(this._statusesOnDay[index]));
    });
    this.drawGraph();
    await this.calcViolations();
  }

  disableWhenDrivingFromELD() {
    let index = this._statusesOnDay.findIndex(el => el.logEventId === this.logEvent.logEventId);
    if (this.logEvent.type.code === 'D' && this.logEvent.recordOrigin.code === 'AUTO') {
      this.disableForm = {
        timeInput: true,
        status: true,
        location: true,
      };
      this.toastService.showToast('Cannot change a Driving log event by ELD', 'warning', 3000);
    }
    if (this._statusesOnDay[index - 1].type.code === 'D' && this._statusesOnDay[index - 1].recordOrigin.code === 'AUTO') {
      this.disableForm = {
        timeInput: true,
        status: false,
        location: false,
      };
      this.toastService.showToast('Cannot change Start time of a log event next to a Driving event by ELD', 'warning', 3000);
    }
  }

  invalidate() {
    this.noValidation = true;
    setTimeout(() => this.shareService.changeMessage('invalidate'), 0);
  }

  validate() {
    this.shareService.changeMessage('reset');
  }

  calculateDuration() {
    if (!this.logEvent.eventTime.timeStampEnd || (this.logEvent.eventTime.timeStampEnd && this.logEvent.eventTime.timeStampEnd === 0)) {
      this.duration = new Date().getTime() - this.logEvent.eventTime.timeStamp;
    } else {
      this.duration = this.logEvent.eventTime.timeStampEnd - this.logEvent.eventTime.timeStamp;
    }
  }

  calculateMinAndMaxValues() {
    let index = this._statusesOnDay.findIndex(el => el.logEventId === this.logEvent.logEventId);
    if (index - 1 === 0) {
      this.minValue = this.getHours(new Date(this.logEvent.eventTime.logDate).setHours(0, 0, 0, 0) + 60000);
      this.minValueNumber = new Date(this.logEvent.eventTime.logDate).setHours(0, 0, 0, 0) + this.timeZoneDifference;
    } else {
      this.minValue = this.getHoursByTimezone(this._statusesOnDay[index - 1].eventTime.timeStamp + 60000);
    }
    if (index === this._statusesOnDay.length - 1) {
      if (!this.logEvent.eventTime.timeStampEnd) {
        this.maxValue = this.getHoursByTimezone(new Date().getTime());
        this.maxValueNumber = new Date().getTime();
        console.log(this.maxValue);
        console.log(this.maxValueNumber);
      } else {
        this.maxValue = this.getHours(new Date(this.logEvent.eventTime.logDate).setHours(23, 59, 0, 0));
        this.maxValueNumber = new Date(this.logEvent.eventTime.logDate).setHours(23, 59, 0, 0) + this.timeZoneDifference;
      }
    } else {
      this.maxValue = this.getHoursByTimezone(this._statusesOnDay[index].eventTime.timeStampEnd - 60000);
    }
  }

  async selectButton(button: string) {
    this.selectedButton = button;
    let localStatus = this.dutyStatuses.find(el => el.value === button);
    this.logEvent.type.code = localStatus.value;
    this.logEvent.type.name = localStatus.label;
    let index = this.logEvents.findIndex(el => el.logEventId === this.logEvent.logEventId);
    console.log(this.logEvent);
    this.logEvents[index] = this.logEvent;
    this.drawGraph();
    await this.calcViolations();
  }

  getCurrentDateFormat(value: string) {
    return '(' + formatDate(value, 'LLLL d', 'en_US') + ')';
  }

  getHours(value: number) {
    return formatDate(value, 'hh:mm:ss a', 'en_US');
  }

  getDate(value: number) {
    return formatDate(value, 'YYYY-MM-ddTHH:mm:ss', 'en_US');
  }

  getDateWithTimezone(value: number) {
    return formatDate(value, 'YYYY-MM-ddTHH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]);
  }

  getHoursByTimezone(value: number) {
    return formatDate(value, 'hh:mm:ss a', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]);
  }

  calculateTimeZoneDifference() {
    this.timeZoneDifference = new Date(this.logEvent.eventTime.logDate).getTime() - new Date(this.getDateWithTimezone(new Date(this.logEvent.eventTime.logDate).getTime())).getTime();
  }

  displayCurrentLogEventRect() {
    try {
      let idx1 = this.eventGraphicLine.findIndex(el => el.historyId === this.logEvent.logEventId);
      this.currentLogEventRect.x1 = this.eventGraphicLine[idx1].x1;
      this.currentLogEventRect.x2 = this.eventGraphicLine[idx1].x2;
    } catch (e) {
      console.log(e);
    }
  }

  async calcViolations() {
    this.clearRect();
    this.bResetTimeLast7Day = false;
    const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];
    this.violations = {};
    let breakT = 0;
    let driveT = 0;
    let driveT2 = 0;
    let shiftT = 0;
    let cycleT = 0;
    let firstEvent: LogEvents;
    let secondEvent: LogEvents;

    let timeNotDrive = 0;

    this.splitSleepData = undefined;

    let localLogEvents: LogEvents[] = JSON.parse(JSON.stringify(this.logEvents));

    let time = 0;
    localLogEvents.forEach((event, index) => {
      if (event.recordStatus?.code === 'ACTIVE') {
        if (allSt.includes(event.type?.code)) {
          firstEvent = JSON.parse(JSON.stringify(event));
          secondEvent = JSON.parse(JSON.stringify(event));
          secondEvent.eventTime.timeStamp = !event.eventTime.timeStampEnd ? new Date().getTime() : JSON.parse(JSON.stringify(event.eventTime.timeStampEnd));
          time = secondEvent.eventTime.timeStamp - firstEvent.eventTime.timeStamp;

          switch (firstEvent.type.code) {
            case 'OFF':
            case 'SB':
            case 'PC':
              breakT += time;
              shiftT += time;
              timeNotDrive += time;

              if (this.splitSleeperBerth) {
                if ((firstEvent.type.code === 'SB' || firstEvent.type.code === 'OFF') && time >= 7200000 && time < this.newShift) {
                  let dur = Math.trunc(time / 1000 / 60 / 60);
                  let splitTime = 2;
                  if (dur >= 2 && dur < 3) {
                    splitTime = 2;
                  } else if (dur >= 3 && dur < 7) {
                    splitTime = 3;
                  } else if (dur >= 3 && dur < 8 && firstEvent.type.code === 'SB') {
                    splitTime = 7;
                  } else if (firstEvent.type.code === 'SB') {
                    splitTime = 8;
                  }

                  if ((splitTime >= 7 && firstEvent.type.code === 'SB') || (splitTime < 7 && dur < 7)) {
                    shiftT = shiftT - time;
                    let temp = {
                      duration: splitTime,
                      time: shiftT,
                      drivingT: driveT,
                    };

                    if (!this.splitSleepData && shiftT) {
                      this.splitSleepData = temp;
                    } else if (this.splitSleepData && shiftT) {
                      if (splitTime + this.splitSleepData.duration >= 10) {
                        shiftT -= this.splitSleepData.time;
                        driveT -= this.splitSleepData.drivingT;
                        this.splitSleepData = {
                          duration: splitTime,
                          time: shiftT,
                          drivingT: driveT,
                        };
                      }
                    }
                  }
                }
              }

              if (breakT >= this.newShift) {
                driveT = 0;
                shiftT = 0;
                this.splitSleepData = undefined;
              }
              if (breakT >= this.restartTime) {
                shiftT = 0;
                cycleT = 0;
                driveT = 0;
                this.splitSleepData = undefined;
                let timeLast7Days = new Date(this.logDailies[7].logDate).getTime();
                if (secondEvent.eventTime.timeStamp > timeLast7Days) {
                  this.bResetTimeLast7Day = true;
                }
              }
              break;
            case 'ON':
            case 'YM':
              breakT = 0;
              timeNotDrive += time;
              shiftT += time;
              cycleT += time;
              if (shiftT > this.shiftLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (shiftT - this.shiftLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  hosErrors.DUTY_LIMIT,
                  secondEvent.eventTime.timeStamp - (shiftT - this.shiftLimit)
                );
                shiftT = 0;
              }
              if (cycleT > this.cycleLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (cycleT - this.cycleLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  hosErrors.US_70_8,
                  secondEvent.eventTime.timeStamp - (cycleT - this.cycleLimit)
                );
                cycleT = 0;
              }
              break;
            case 'D':
              breakT = 0;
              driveT2 += time;
              driveT += time;
              shiftT += time;
              cycleT += time;
              if (driveT2 > this.driveWithoutBreakLimit && timeNotDrive < this.notDriveLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (driveT2 - this.driveWithoutBreakLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  hosErrors.REST_BREAK,
                  secondEvent.eventTime.timeStamp - (driveT2 - this.driveWithoutBreakLimit)
                );
              }
              // if (time > this.driveWithoutBreakLimit) {
              //   this.pushViolation(
              //     formatDate(new Date(firstEvent.eventTime.timeStamp + this.driveWithoutBreakLimit), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
              //     'Driving non-stop for more than 8 hours',
              //     firstEvent.eventTime.timeStamp + this.driveWithoutBreakLimit
              //   );
              // }
              if (driveT > this.driveLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (driveT - this.driveLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  hosErrors.DRIVING,
                  secondEvent.eventTime.timeStamp - (driveT - this.driveLimit)
                );
                driveT = 0;
              }
              if (shiftT > this.shiftLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (shiftT - this.shiftLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  hosErrors.DUTY_LIMIT,
                  secondEvent.eventTime.timeStamp - (shiftT - this.shiftLimit)
                );
                shiftT = 0;
              }
              if (cycleT > this.cycleLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (cycleT - this.cycleLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  hosErrors.US_70_8,
                  secondEvent.eventTime.timeStamp - (cycleT - this.cycleLimit)
                );
                cycleT = 0;
              }
              timeNotDrive = 0;
              break;
          }
          if (timeNotDrive >= this.notDriveLimit) {
            timeNotDrive = 0;
            driveT2 = 0;
          }
        }
      }
    });
    console.log(this.violations);
  }

  pushViolation(day: string, error: { code: string; name: string }, date: number) {
    let local = {
      startTime: date,
      timeZone: '',
      regulations: {
        code: error.code,
        name: error.name,
      },
    };
    if (this.violations[day]) {
      this.violations[day].push(local);
    } else {
      this.violations[day] = [local];
    }
  }

  clearRect() {
    this.violationRect.x1 = 0;
    this.violationRect.x2 = 0;
  }

  toggleViolationRect(violation: {
    startTime: number;
    regulations: {
      code: string;
      name: string;
    };
  }) {
    try {
      const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];
      let index = this.logEvents.findIndex(el => el.eventTime.timeStamp > violation.startTime && allSt.includes(el.type.code));
      let start = new Date(formatDate(new Date(violation.startTime), 'yyyy-MM-dd HH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]));
      let end;
      let sEnd;
      let begin;
      let finish;
      // console.log(this.logEvents[index]);
      if (this.logEvents[index]?.eventTime?.timeStamp) end = new Date(this.logEvents[index].eventTime.timeStamp);
      else end = new Date();
      sEnd = new Date(formatDate(new Date(end), 'yyyy-MM-dd HH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]));
      if (formatDate(start, 'yyyy/MM/dd', 'en_US') === formatDate(this.currentDay, 'yyyy/MM/dd', 'en_US')) {
        begin = start.getHours() * 60 + start.getMinutes();
      } else {
        begin = 0;
      }
      if (formatDate(sEnd, 'yyyy/MM/dd', 'en_US') === formatDate(this.currentDay, 'yyyy/MM/dd', 'en_US')) {
        finish = sEnd.getHours() * 60 + sEnd.getMinutes();
        // console.log(sEnd);
      } else {
        finish = 1440;
      }

      this.violationRect.x1 = begin;
      this.violationRect.x2 = finish;
    } catch (e) {
      console.log(e);
    }
  }
  async updateLogDailies(logDaily: LogDailies) {
    if ((await Network.getStatus()).connected) {
      await firstValueFrom(this.dashboardService.updateLogDaily(logDaily))
        .then(async response => {
          console.log('LogDaily (durationStatuses) is updated on server:', response);
          await this.updateIndexLogDaily(logDaily, true);
        })
        .catch(async error => {
          await this.updateIndexLogDaily(logDaily, false);
          console.log('Pushed in logDailies');
        });
    } else {
      console.log('Updated logEvents in offline array');
      await this.updateIndexLogDaily(logDaily, false);
    }
  }
  async updateIndexLogDaily(logDailyData: LogDailies, online: boolean) {
    logDailyData.sent = online;
    const index = this.logDailies.findIndex(item => item.logDailyId === logDailyData.logDailyId);
    if (index !== -1) {
      this.logDailies[index] = logDailyData;
    }
    await this.storage.set('logDailies', this.logDailies);
  }
}
