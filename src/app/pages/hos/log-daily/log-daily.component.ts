import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { InternetService } from 'src/app/services/internet.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { LogDailies } from 'src/app/models/log-dailies';
import { LogEvents } from 'src/app/models/log-histories';
import { EventGraphic } from 'src/app/models/event-graphic';
import { Storage } from '@ionic/storage';
import { OverlayEventDetail } from '@ionic/core/components';
import SignaturePad from 'signature_pad';
import { NavController } from '@ionic/angular';
import { UtilityService } from 'src/app/services/utility.service';
import { ShareService } from 'src/app/services/share.service';
import { ToastService } from 'src/app/services/toast.service';
import { ManageService } from 'src/app/services/manage.service';
import { timeZoneSummer, timeZoneWinter, seasonChanges } from 'src/app/models/timeZone';
import { Network } from '@capacitor/network';
import { hosErrors } from 'src/app/utilities/hos-errors';
import { TranslateService } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';
import { Driver } from 'src/app/models/driver';

@Component({
  selector: 'app-log-daily',
  templateUrl: './log-daily.component.html',
  styleUrls: ['./log-daily.component.scss'],
})
export class LogDailyComponent implements OnInit, OnDestroy, OnChanges {
  @Input() triggerRefresh: boolean = false;

  @ViewChild('sPad', { static: false }) signaturePadElement!: ElementRef;
  LogDailiesId!: string | null;
  bReady: boolean = false;
  timeZone: string = '';
  vehicleUnit: string = '';
  logDailies: LogDailies[] = [];
  logEvents: LogEvents[] = [];
  statusEvents: LogEvents[] = [];
  timeZones: { [key: string]: string } = {};
  logDaily: LogDailies | undefined;
  currentDay: string | undefined = '';
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
  signaturePad!: SignaturePad;
  signature: string = '';
  driverId: string = '';
  vehicleId: string = '';
  today = formatDate(new Date(), 'yyyy/MM/dd', 'en_US');
  isModalOpen: boolean = false;
  imageLoading: boolean = false;
  saveFormLoading: boolean = false;

  localForm: Partial<LogDailies> = {
    formManner: false,
    form: {
      signatureId: '',
      trailers: '',
      shippingDoc: '',
      coDriver: null,
    },
  };

  logDailiesSub: Subscription;

  signaturePadOptions: any = {
    minWidth: 2,
    maxWidth: 3,
    backgroundColor: '#FFFFFF',
    penColor: 'black',
  };

  validation: { [key: string]: boolean } = {
    shippingDoc: false,
  };

  finishedLoading: boolean = false;

  networkSub: Subscription;

  durationsOFF = 0;
  durationsSB = 0;
  durationsD = 0;
  durationsON = 0;

  violationRect = {
    x1: 0,
    x2: 0,
  };

  oldNetworkState: boolean = null;
  isLogs: boolean = true;

  chosenDriver: string = 'None';

  coDrivers: Driver[] = [];
  coDriverNames: string[] = [];
  coDriver: Driver | Partial<Driver>;

  constructor(
    private router: Router,
    private databaseService: DatabaseService,
    private storage: Storage,
    private internetService: InternetService,
    private dashboardService: DashboardService,
    private toastService: ToastService,
    private navCtrl: NavController,
    private utilityService: UtilityService,
    private shareService: ShareService,
    private manageService: ManageService,
    private translate: TranslateService,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    console.log('OnInit');
    this.timeZones = this.utilityService.checkSeason();
    this.shareService.destroyMessage();
    this.shareService.changeMessage('reset');
    this.clearRect();
    this.vehicleId = await this.storage.get('vehicleId');
    this.driverId = await this.storage.get('driverId');
    this.vehicleUnit = await this.storage.get('vehicleUnit');
    this.timeZone = await this.storage.get('timeZone');
    this.networkSub = this.internetService.interetStatusObs.subscribe(async state => {
      if (state && state !== this.oldNetworkState) {
        this.logDailies = await firstValueFrom(this.databaseService.getLogDailies());
        if (this.LogDailiesId) {
          this.logDaily = this.logDailies.find(item => item.logDailyId === this.LogDailiesId);
        }
        this.oldNetworkState = state;
      }
    });
    // this.fetchData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['triggerRefresh'] && changes['triggerRefresh'].currentValue !== undefined && changes['triggerRefresh'].currentValue !== null) {
      this.fetchData();
    }
  }

  fetchData() {
    this.clearRect();
    this.shareService.destroyMessage();
    this.shareService.changeMessage('reset');
    const logDailies$ = this.databaseService.getLogDailies();
    const logEvents$ = this.databaseService.getLogEvents();
    let coDrivers$ = this.storage.get('coDrivers');

    forkJoin([logDailies$, logEvents$, coDrivers$]).subscribe(([logDailies, logEvents, coDrivers]) => {
      this.logDailies = logDailies;
      this.logEvents = logEvents;
      this.coDriverNames = [];
      this.coDrivers = (coDrivers as Driver[]).slice().filter(el => el.driverId !== this.driverId);
      this.coDriverNames = this.coDrivers.map(el => el.name);
      this.logEvents.forEach(logEvent => (logEvent.type.code !== 'LOGIN' && logEvent.type.code !== 'LOGOUT' ? this.statusEvents.push(logEvent) : null));

      if (this.logDailies.length === 0 || this.logDailies.length < 14) this.storage.get('logDailies').then(data => (this.logDailies = data));
      if (this.LogDailiesId !== undefined && this.LogDailiesId !== null && this.LogDailiesId.length !== 0) {
        this.logDaily = this.logDailies.find(el => el.logDailyId === this.LogDailiesId);
      } else {
        this.logDaily = this.logDailies[0];
        this.LogDailiesId = this.logDaily.logDailyId;
      }
      if (this.logDaily) {
        this.currentDay = this.logDaily.logDate;
        this.fillFormWithLogDailyData();
      }
      this.drawGraph();
      this.fillFormWithLogDailyData();
    });
  }

  // async ionViewDidEnter() {
  // }

  ngOnDestroy(): void {
    this.shareService.destroyMessage();
    this.shareService.changeMessage('reset');
    if (this.networkSub) this.networkSub.unsubscribe();
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
  }

  signatureTimeout() {
    setTimeout(() => {
      if (!this.finishedLoading) {
        this.imageLoading = false;
        this.clearSignature();
      }
    }, 5000);
  }

  getStatusColor(status: string) {
    if (status) {
      let colorObj = {
        OFF: 'var(--off-duty)',
        SB: 'var(--split-spleeper-berth)',
        ON: 'var(--warning-400)',
        D: 'var(--success-500)',
        PC: 'repeating-linear-gradient(45deg,var(--off-duty),var(--off-duty) 10px,var(--gray-200) 10px,var(--gray-200) 20px)',
        YM: 'repeating-linear-gradient(45deg,var(--warning-300),var(--warning-300) 10px,var(--warning-200) 10px,var(--warning-200) 20px)',
      };
      return colorObj[status as keyof typeof colorObj];
    }
    return 'var(--success-500)';
  }

  getDateSub(date: string) {
    let date_ =
      this.translate.instant(formatDate(date, 'EEEE', 'en_US')) + ', ' + this.translate.instant(formatDate(date, 'MMM', 'en_US')) + ' ' + this.translate.instant(formatDate(date, 'd', 'en_US'));
    let today_ =
      this.translate.instant(formatDate(new Date(), 'EEEE', 'en_US')) +
      ', ' +
      this.translate.instant(formatDate(new Date(), 'MMM', 'en_US')) +
      ' ' +
      this.translate.instant(formatDate(new Date(), 'd', 'en_US'));
    return date_ === today_ ? date_ + ' (' + this.translate.instant('Today') + ')' : date_;
  }

  fillFormWithLogDailyData() {
    if (this.logDaily) {
      this.localForm = {
        form: {
          trailers: this.logDaily.form.trailers || '',
          shippingDoc: this.logDaily.form.shippingDoc || '',
          fromAddress: this.logDaily.form.fromAddress || '',
          toAddress: this.logDaily.form.toAddress || '',
          signatureId: '',
        },
      };
    }
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
  }

  goToNextLog() {
    this.clearRect();
    const currentIndex = this.logDailies.findIndex(item => item.logDailyId === this.logDaily?.logDailyId);
    const nextIndex = currentIndex + 1;

    if (nextIndex < this.logDailies.length) {
      this.logDaily = this.logDailies[nextIndex];
      this.LogDailiesId = this.logDailies[nextIndex].logDailyId;
      this.scrollToItem(nextIndex);
      this.fillFormWithLogDailyData();
      this.drawGraph();
    }
    this.shareService.changeMessage('reset');
  }

  goToPreviousLog() {
    this.clearRect();
    const currentIndex = this.logDailies.findIndex(item => item.logDailyId === this.logDaily?.logDailyId);
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      this.logDaily = this.logDailies[previousIndex];
      this.LogDailiesId = this.logDailies[previousIndex].logDailyId;
      this.scrollToItem(previousIndex);
      this.fillFormWithLogDailyData();
      this.drawGraph();
    }
    this.shareService.changeMessage('reset');
  }

  async onSubmit() {
    this.shareService.changeMessage(this.utilityService.generateString(5));
    if (!this.utilityService.validateForm(this.validation)) return;

    if (this.logDaily) {
      this.logDaily.form.trailers = this.localForm.form.trailers;
      this.logDaily.form.shippingDoc = this.localForm.form.shippingDoc;
      this.logDaily.formManner = true;
    }

    this.saveFormLoading = true;

    let networkStatus = (await Network.getStatus()).connected;

    await this.updateIndexLogDaily(this.logDaily as LogDailies, false).then(
      async response => {
        if (networkStatus)
          firstValueFrom(this.dashboardService.updateLogDaily(this.logDaily as LogDailies))
            .then(res => {
              console.log(`LogDaily ${this.logDaily} is updated on server:`, response);
            })
            .catch(e => {
              this.updateIndexLogDaily(this.logDaily as LogDailies, false);
            });
        this.saveFormLoading = false;
        this.toastService.showToast(this.translate.instant('Saved successfully!'), 'success');
      },
      async error => {
        await this.updateIndexLogDaily(this.logDaily as LogDailies, false);
        this.saveFormLoading = false;
        this.toastService.showToast(this.translate.instant('Offline save!'), 'warning');
      }
    );
  }

  async updateLogDaily(logDailyData: LogDailies, online: boolean) {
    logDailyData.sent = online;
    this.logDailies.push(logDailyData);
    await this.storage.set('logDailies', this.logDailies);
  }

  async updateIndexLogDaily(logDailyData: LogDailies, online: boolean) {
    logDailyData.sent = online;
    const index = this.logDailies.findIndex(item => item.logDailyId === logDailyData.logDailyId);
    if (index !== -1) {
      this.logDailies[index] = logDailyData;
    }
    await this.storage.set('logDailies', this.logDailies);
  }

  initSignaturePad() {
    const driverSignatureCanvas: HTMLCanvasElement | null = this.signaturePadElement.nativeElement;
    if (driverSignatureCanvas) {
      this.signaturePad = new SignaturePad(driverSignatureCanvas, this.signaturePadOptions);
      driverSignatureCanvas.addEventListener('touchend', () => {
        this.updateSignatureField();
      });
    }
  }

  restoreSignature() {
    const firstNonEmptySignature = this.logDailies.find(log => log.form.signatureId !== '');

    if (firstNonEmptySignature) {
      this.renderSignature(firstNonEmptySignature.form.signatureId);
    }
  }

  renderSignature(signatureData: string) {
    const canvas: HTMLCanvasElement | null = this.signaturePadElement.nativeElement;

    if (canvas) {
      const context = canvas.getContext('2d');
      const image = new Image();

      image.onload = () => {
        context?.drawImage(image, 0, 0);
      };
      image.src = 'data:image/png;base64,' + signatureData;
      this.signature = signatureData;
    }
  }

  updateSignatureField() {
    if (this.signaturePad && !this.signaturePad.isEmpty()) {
      const signatureDataURL = this.signaturePad.toDataURL().slice(22);
      this.signature = signatureDataURL;
    } else {
      this.signature = '';
    }
  }

  clearSignature() {
    if (this.signaturePad) {
      this.signaturePad.clear();
      this.signature = '';
    }
  }

  openModal() {
    this.isModalOpen = true;
    this.imageLoading = true;
    this.signatureTimeout();
  }

  imageLoaded() {
    this.imageLoading = false;
    this.finishedLoading = true;
  }

  cancel() {
    this.isModalOpen = false;
  }

  nevigateToInspection() {
    this.navCtrl.navigateForward('/inspection-preview', { queryParams: { logId: this.logDaily.logDailyId, url: 'log-item' } });
  }

  // ionViewWillLeave() {

  // }

  certifyLog() {
    if (!this.logDaily.formManner && this.statusesOnDay.length >= 2) {
      this.toastService.showToast(this.translate.instant('You must complete the form first!'));
      // this.validation = {
      //   shippingDoc: false,
      //   coDriver: false,
      // };
      this.shareService.changeMessage(this.utilityService.generateString(5));
      if (!this.utilityService.validateForm(this.validation)) return;
      return;
    }
    this.validation = {
      shippingDoc: true,
      coDriver: true,
    };
    console.log(this.validation);
    this.navCtrl.navigateForward('log-certify', { queryParams: { date: this.logDaily.logDate, logId: this.logDaily.logDailyId } });
  }

  editLog(logStatus: LogEvents) {
    this.navCtrl.navigateForward('edit-duty-status', { queryParams: { logDailyId: this.logDaily.logDailyId, logEventId: logStatus.logEventId } });
  }

  // goBack() {
  //   this.navCtrl.navigateBack('unitab/hos');
  // }

  logEventDuration(logStatus: LogEvents) {
    return this.utilityService.msToTime(
      logStatus.eventTime.timeStampEnd !== undefined && logStatus.eventTime.timeStampEnd !== 0
        ? logStatus.eventTime.timeStampEnd - logStatus.eventTime.timeStamp
        : new Date().getTime() - logStatus.eventTime.timeStamp
    );
  }

  formatLocalDate(date: number) {
    return formatDate(new Date(date), 'h:mm:ss a', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]);
  }

  canBeInspected() {
    let limitDate = new Date();
    limitDate.setHours(0, 0, 0, 0);
    limitDate.setDate(new Date().getDate() - 7);
    return limitDate.getTime() <= new Date(this.logDaily?.logDate).getTime();
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
      let start = new Date(formatDate(new Date(violation.startTime), 'yyyy-MM-ddTHH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]));
      let end;
      let sEnd;
      let begin;
      let finish;
      // console.log(this.logEvents[index]);
      if (this.logEvents[index]?.eventTime?.timeStamp) end = new Date(this.logEvents[index].eventTime.timeStamp);
      else end = new Date();
      sEnd = new Date(formatDate(new Date(end), 'yyyy-MM-ddTHH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]));
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

  insertStatus() {
    this.navCtrl.navigateForward('insert-duty-status', { queryParams: { logDailyId: this.logDaily.logDailyId } });
  }

  getPlatform() {
    return Capacitor.getPlatform();
  }

  changeLog(logDaily: LogDailies, index: number) {
    this.clearRect();
    const currentIndex = this.logDailies.findIndex(item => item.logDailyId === logDaily.logDailyId);

    this.logDaily = this.logDailies[currentIndex];
    this.LogDailiesId = this.logDailies[currentIndex].logDailyId;
    this.scrollToItem(currentIndex);
    this.fillFormWithLogDailyData();
    this.drawGraph();

    this.shareService.changeMessage('reset');
  }

  toggleLogsForm(flag: string) {
    this.shareService.changeMessage('reset');
    if (flag === 'logs') {
      this.isLogs = true;
    } else {
      this.isLogs = false;
    }
  }

  showSelection() {
    if (this.chosenDriver === 'None') {
      this.coDriver = {
        driverId: '00000000-0000-0000-0000-000000000000',
        driverIdentifier: null,
        driverInfo: null,
        email: null,
        firstName: null,
        lastName: null,
      };
    } else {
      this.coDriver = this.coDrivers.find(coDriver => coDriver.name === this.chosenDriver) || {
        driverId: '00000000-0000-0000-0000-000000000000',
        driverIdentifier: null,
        driverInfo: null,
        email: null,
        firstName: null,
        lastName: null,
      };
    }
  }

  scrollToItem(index: number) {
    const container = document.getElementById('logdailies');
    const item = document.getElementById('logdaily' + index);

    if (container && item) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      const itemLeftVisible = itemRect.left >= containerRect.left;
      const itemRightVisible = itemRect.right <= containerRect.right;

      if (!itemLeftVisible) {
        // Scroll to the left just enough to make the item visible
        const newScrollLeft = container.scrollLeft + (itemRect.left - containerRect.left);
        container.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth',
        });
      } else if (!itemRightVisible) {
        // Scroll to the right just enough to make the item visible
        const newScrollLeft = container.scrollLeft + (itemRect.right - containerRect.right);
        container.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth',
        });
      }
    }
  }
}
