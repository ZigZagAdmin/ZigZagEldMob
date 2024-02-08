import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { InternetService } from 'src/app/services/internet.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Subscription, forkJoin } from 'rxjs';
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

@Component({
  selector: 'app-log-item-daily',
  templateUrl: './log-item-daily.component.html',
  styleUrls: ['./log-item-daily.component.scss'],
})
export class LogItemDailyComponent implements OnInit {
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
  networkStatus = false;
  networkSub!: Subscription;
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
      trailers: '',
      shippingDoc: '',
      toAddress: '',
      fromAddress: '',
      signatureId: '',
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
    toAddress: false,
    fromAddress: false,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private databaseService: DatabaseService,
    private storage: Storage,
    private internetService: InternetService,
    private dashboardService: DashboardService,
    private toastService: ToastService,
    private navCtrl: NavController,
    private utilityService: UtilityService,
    private shareService: ShareService,
    private manageService: ManageService
  ) {}

  ngOnInit(): void {
    this.timeZones = this.utilityService.checkSeason();
  }

  async ionViewWillEnter() {
    this.vehicleId = await this.storage.get('vehicleId');
    this.driverId = await this.storage.get('driverId');
    this.vehicleUnit = await this.storage.get('vehicleUnit');
    this.timeZone = await this.storage.get('timeZone');
    this.activatedRoute.params.subscribe(params => {
      this.LogDailiesId = params['id'];
    });

    this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
      if (ready) {
        this.bReady = ready;

        const logDailies$ = this.databaseService.getLogDailies();
        const logEvents$ = this.databaseService.getLogEvents();

        forkJoin([logDailies$, logEvents$]).subscribe(([logDailies, logEvents]) => {
          this.logDailies = logDailies;
          this.logEvents = logEvents;
          this.logEvents.forEach(logEvent => (logEvent.type.code !== 'LOGIN' && logEvent.type.code !== 'LOGOUT' ? this.statusEvents.push(logEvent) : null));

          if (this.logDailies.length === 0 || this.logDailies.length < 14) this.storage.get('logDailies').then(data => (this.logDailies = data));

          this.logDaily = this.logDailies.find(item => item.logDailyId === this.LogDailiesId);
          if (this.logDaily) {
            this.currentDay = this.logDaily.logDate;
            this.fillFormWithLogDailyData();
          }
          this.drawGraph();
          this.fillFormWithLogDailyData();
        });
      }
    });

    this.networkSub = this.internetService.internetStatus$.subscribe(status => {
      this.networkStatus = status;
    });

    this.logDailiesSub = this.manageService.getLogDailies(this.driverId, formatDate(new Date(), 'yyyy-MM-dd', 'en_US'), 14).subscribe(logDailies => {
      this.logDailies = logDailies;
      this.logDaily = this.logDailies.find(item => item.logDailyId === this.LogDailiesId);
    });
  }

  ngOnDestroy(): void {
    this.shareService.destroyMessage();
    this.logDailiesSub.unsubscribe();
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

  getDateSub(date: string) {
    let date_ = formatDate(date, 'EEEE, MMM d', 'en_US');
    let today_ = formatDate(new Date(), 'EEEE, MMM d', 'en_US');
    return date_ === today_ ? date_ + ' (Today)' : date_;
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

  navigateToInsertDutyStatus() {}

  navigateToEditDutyStatus() {}

  goToNextLog() {
    const currentIndex = this.logDailies.findIndex(item => item.logDailyId === this.logDaily?.logDailyId);
    const nextIndex = currentIndex + 1;

    if (nextIndex < this.logDailies.length) {
      this.logDaily = this.logDailies[nextIndex];
      // this.navCtrl.navigateRoot(['log-item', this.logDaily.logDailyId], { animated: false });
      this.fillFormWithLogDailyData();
      this.drawGraph();
    }
    this.shareService.changeMessage('reset');
  }

  goToPreviousLog() {
    const currentIndex = this.logDailies.findIndex(item => item.logDailyId === this.logDaily?.logDailyId);
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      this.logDaily = this.logDailies[previousIndex];
      // this.navCtrl.navigateRoot(['log-item', this.logDaily.logDailyId], { animated: false });
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
      this.logDaily.form.fromAddress = this.localForm.form.fromAddress;
      this.logDaily.form.toAddress = this.localForm.form.toAddress;
      this.logDaily.formManner = true;
    }

    this.saveFormLoading = true;

    let networkStatus = (await Network.getStatus()).connected;

    if (networkStatus) {
      this.dashboardService.updateLogDaily(this.logDaily as LogDailies).subscribe(
        async response => {
          console.log(`LogDaily ${this.logDaily} is updated on server:`, response);
          await this.updateIndexLogDaily(this.logDaily as LogDailies, true);
          this.saveFormLoading = false;
          this.toastService.showToast('Saved successfully!', 'success');
        },
        async error => {
          await this.updateIndexLogDaily(this.logDaily as LogDailies, false);
          this.saveFormLoading = false;
          this.toastService.showToast('Offline save!', 'warning');
        }
      );
    } else {
      console.log('Updated logEvents in offline array');
      await this.updateIndexLogDaily(this.logDaily as LogDailies, false);
    }
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
  }

  imageLoaded() {
    this.imageLoading = false;
  }

  cancel() {
    this.isModalOpen = false;
  }

  nevigateToInspection() {
    this.navCtrl.navigateForward('/inspection-preview', { queryParams: { logId: this.logDaily.logDailyId, url: 'log-item' } });
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
    this.networkSub.unsubscribe();
  }

  certifyLog() {
    this.navCtrl.navigateForward('log-certify', { queryParams: { date: this.logDaily.logDate, logId: this.logDaily.logDailyId } });
  }

  editLog() {
    this.navCtrl.navigateForward('edit-duty-status', { queryParams: { url: this.router.url } });
  }

  goBack() {
    this.navCtrl.navigateBack('unitab/hos');
  }

  logEventDuration(logStatus: LogEvents) {
    return this.utilityService.msToTime(
      logStatus.eventTime.timeStampEnd !== undefined && logStatus.eventTime.timeStampEnd !== 0
        ? logStatus.eventTime.timeStampEnd - logStatus.eventTime.timeStamp
        : new Date().getTime() - logStatus.eventTime.timeStamp
    );
  }

  canBeInspected() {
    let limitDate = new Date();
    limitDate.setHours(0, 0, 0, 0);
    limitDate.setDate(new Date().getDate() - 7);
    return limitDate.getTime() <= new Date(this.logDaily?.logDate).getTime();
  }
}
