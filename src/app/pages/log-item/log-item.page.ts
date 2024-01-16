import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { ToastController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import SignaturePad from 'signature_pad';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-log-item',
  templateUrl: './log-item.page.html',
  styleUrls: ['./log-item.page.scss'],
})
export class LogItemPage implements OnInit {
  @ViewChild('sPad', { static: false }) signaturePadElement!: ElementRef;
  @ViewChild(IonModal) modal!: IonModal;
  form!: FormGroup;
  LogDailiesId!: string | null;
  bReady: boolean = false;
  TimeZoneCity: string = '';
  PickedVehicle: string = '';
  logDailies: LogDailies[] = [];
  logEvents: LogEvents[] = [];
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
  today = new Date();

  signaturePadOptions: any = {
    minWidth: 2,
    maxWidth: 3,
    backgroundColor: '#FFFFFF',
    penColor: 'black',
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private databaseService: DatabaseService,
    private storage: Storage,
    private internetService: InternetService,
    private dashboardService: DashboardService,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private navCtrl: NavController
  ) {
    this.form = this.formBuilder.group({
      Vehicles: [''],
      Trailers: [''],
      ShippingDocuments: ['', Validators.required],
      FromAdress: ['', Validators.required],
      ToAdress: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.vehicleId = await this.storage.get('vehicleId');
    this.driverId = await this.storage.get('driverId');
    this.PickedVehicle = await this.storage.get('vehicleUnit');
    this.TimeZoneCity = await this.storage.get('TimeZoneCity');
    this.activatedRoute.queryParams.subscribe(params => {
      this.LogDailiesId = params['logId'];
      console.log(this.LogDailiesId);
    });

    // this.databaseSubscription =
    // this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
    //   if (ready) {
    //     this.bReady = ready;
    //     this.databaseService.getLogDailies().subscribe((logDailies) => {
    //       this.logDailies = logDailies;
    //       this.logDaily = this.logDailies.find(
    //         (item) => item.LogDailiesId === this.LogDailiesId
    //       );
    //       if (this.logDaily) {
    //         console.log(this.logDaily);
    //         this.currentDay = this.logDaily.Day;
    //         this.fillFormWithLogDailyData();
    //       }
    //     });
    //     this.databaseService.getLogEvents().subscribe((logEvents) => {
    //       // const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];
    //       // this.logEvents = logEvents.filter((item) =>
    //       //   allSt.includes(item.EventTypeCode)
    //       // );
    //       this.logEvents = logEvents;
    //       this.logEvents.forEach((log) => {
    //         if (log.DateEnd === '0001-01-01T00:00:00') {
    //           log.DateEnd = formatDate(
    //             new Date().toLocaleString('en-US', {
    //               timeZone: this.TimeZoneCity,
    //             }),
    //             'yyyy-MM-ddTHH:mm:ss',
    //             'en_US'
    //           );
    //         }
    //       });
    //       console.log(this.logEvents);
    //       this.drawGraph();
    //     });
    //   }
    // });

    this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
      if (ready) {
        this.bReady = ready;

        const logDailies$ = this.databaseService.getLogDailies();
        const logEvents$ = this.databaseService.getLogEvents();

        forkJoin([logDailies$, logEvents$]).subscribe(([logDailies, logEvents]) => {
          this.logDailies = logDailies;
          this.logEvents = logEvents;

          if (this.logDailies.length === 0 || this.logDailies.length < 14) this.storage.get('logDailies').then(data => (this.logDailies = data));

          console.log(this.logDailies);
          this.logDaily = this.logDailies.find(item => item.logDailyId === this.LogDailiesId);
          if (this.logDaily) {
            console.log(this.logDaily);
            this.currentDay = this.logDaily.logDate;
            this.fillFormWithLogDailyData();
          }
          // this.logEvents.forEach(log => {
          //   if (log.DateEnd === '0001-01-01T00:00:00') {
          //     log.DateEnd = formatDate(
          //       new Date().toLocaleString('en-US', {
          //         timeZone: this.TimeZoneCity,
          //       }),
          //       'yyyy-MM-ddTHH:mm:ss',
          //       'en_US'
          //     );
          //   }
          // });
          console.log(this.logEvents);
          console.log(this.logDaily);
          this.drawGraph();
          this.fillFormWithLogDailyData();
        });
      }
    });

    this.networkSub = this.internetService.internetStatus$.subscribe(status => {
      this.networkStatus = status;
      console.log('Intenet Status' + status);
    });
  }

  fillFormWithLogDailyData() {
    if (this.logDaily) {
      this.form.patchValue({
        Trailers: this.logDaily.form.trailers || '',
        ShippingDocuments: this.logDaily.form.shippingDoc || '',
        FromAdress: this.logDaily.form.fromAddress || '',
        ToAdress: this.logDaily.form.toAddress || '',
      });
    }
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
    console.log(this.logDaily);

    console.log(this.logEvents);

    this.logEvents.forEach(event => {
      if (allSt.includes(event.type.code)) {
        if (event.eventTime.timeStampEnd) sDateEnd = new Date(event.eventTime.timeStampEnd).toISOString();
        else sDateEnd = new Date().toISOString();

        console.log(sDateEnd);
        if (sDateEnd == '0001-01-01T00:00:00') {
          sDateEnd = formatDate(
            new Date().toLocaleString('en-US', {
              timeZone: this.TimeZoneCity,
            }),
            'yyyy-MM-ddTHH:mm:ss',
            'en_US'
          );
        }

        console.log(formatDate(new Date(event.eventTime.timeStamp), 'yyyy-MM-dd', 'en_US'));
        console.log(this.currentDay);
        console.log(formatDate(new Date(this.currentDay), 'yyyy-MM-dd', 'en_US'));
        console.log(formatDate(new Date(sDateEnd), 'yyyy-MM-dd', 'en_US'));

        if (
          formatDate(new Date(event.eventTime.timeStamp), 'yyyy-MM-dd', 'en_US') <= formatDate(new Date(this.currentDay), 'yyyy-MM-dd', 'en_US') &&
          formatDate(new Date(this.currentDay), 'yyyy-MM-dd', 'en_US') <= formatDate(new Date(sDateEnd), 'yyyy-MM-dd', 'en_US')
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

  navigateToInsertDutyStatus() {}

  navigateToEditDutyStatus() {}

  goToNextLog() {
    const currentIndex = this.logDailies.findIndex(item => item.logDailyId === this.logDaily?.logDailyId);
    const nextIndex = currentIndex + 1;

    if (nextIndex < this.logDailies.length) {
      this.logDaily = this.logDailies[nextIndex];
      this.fillFormWithLogDailyData();
      this.drawGraph();
    }
  }

  goToPreviousLog() {
    const currentIndex = this.logDailies.findIndex(item => item.logDailyId === this.logDaily?.logDailyId);
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      this.logDaily = this.logDailies[previousIndex];
      this.fillFormWithLogDailyData();
      this.drawGraph();
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      // this.logDaily.Vehicles = this.form.value.Vehicles;
      if (this.logDaily) {
        this.logDaily.form.trailers = this.form.value.Trailers;
        this.logDaily.form.shippingDoc = this.form.value.ShippingDocuments;
        this.logDaily.form.fromAddress = this.form.value.FromAdress;
        this.logDaily.form.toAddress = this.form.value.ToAdress;
        this.logDaily.formManner = true;
      }

      if (this.networkStatus === true) {
        this.dashboardService.updateLogDaily(this.logDaily as LogDailies).subscribe(
          response => {
            console.log(`LogDaily ${this.logDaily} is updated on server:`, response);
          },
          async error => {
            console.log('Internet Status' + this.networkStatus);
            let tempEerror = {
              url: 'api/EldDashboard/uploadDVIR',
              body: this.logDaily,
            };
            let offlineArray = await this.storage.get('offlineArray');
            offlineArray.push(tempEerror);
            await this.storage.set('offlineArray', offlineArray);
            console.log('Pushed in offlineArray');
          }
        );
      } else {
        let tempEerror = {
          url: 'api/EldDashboard/uploadDVIR',
          body: this.logDaily,
        };
        let offlineArray = await this.storage.get('offlineArray');
        offlineArray.push(tempEerror);
        await this.storage.set('offlineArray', offlineArray);
        console.log('Pushed in offlineArray');
      }
      const index = this.logDailies.findIndex(item => item.logDailyId === this.logDaily?.logDailyId);
      if (index !== -1) {
        this.logDailies[index] = this.logDaily as LogDailies;
      }
      await this.storage.set('logDailies', this.logDailies);
      this.presentToast('Saved successfully!');
    }
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
    console.log(this.signature);
  }

  clearSignature() {
    console.log('clear');
    if (this.signaturePad) {
      this.signaturePad.clear();
      this.signature = '';
    }
  }

  async openModal() {
    await this.modal.present();
    this.initSignaturePad();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.signature, 'confirm');
  }

  async onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      const lastLogEvent = this.logEvents[this.logEvents.length - 1];
      let CetificationLogEvent: LogEvents = {
        logEventId: this.uuidv4(),
        companyId: '',
        driverId: this.driverId,
        eventTime: {
          logDate: '',
          timeStamp: new Date().getTime(),
          timeStampEnd: new Date().getTime(),
          timeZone: '',
        },
        vehicle: {
          vehicleId: this.vehicleId,
        },
        eld: {
          eldId: '',
          macAddress: '',
          serialNumber: '',
        },
        location: {
          locationType: 'AUTOMATIC',
          description: '2mi from Chisinau, Chisinau',
          latitude: 0,
          longitude: 0,
        },
        sequenceNumber: lastLogEvent ? lastLogEvent.sequenceNumber + 1 : 1,
        type: { name: 'Certification (1)', code: 'CERTIFICATION_1' },
        recordStatus: { name: 'Driver', code: 'DRIVER' },
        recordOrigin: { name: 'Active', code: 'ACTIVE' },
        odometer: 0,
        engineHours: 0,
        malfunction: false,
        dataDiagnosticEvent: false,
        certificationDate: this.logDaily?.logDate,
        comment: '',
        eventDataCheck: '',
        inspection: false,
      };

      if (this.networkStatus === true) {
        this.dashboardService.updateLogEvent(CetificationLogEvent).subscribe(
          response => {
            console.log('Certification LogEvent is on server:', response);
          },
          async error => {
            console.log('Internet Status' + this.networkStatus);
            let tempEerror = {
              url: 'api/EldDashboard/UploadLogEvents',
              body: CetificationLogEvent,
            };
            let offlineArray = await this.storage.get('offlineArray');
            offlineArray.push(tempEerror);
            await this.storage.set('offlineArray', offlineArray);
            console.log('Cerification LogEvent Pushed in offlineArray');
          }
        );
      } else {
        let tempEerror = {
          url: 'api/EldDashboard/UploadLogEvents',
          body: CetificationLogEvent,
        };
        let offlineArray = await this.storage.get('offlineArray');
        offlineArray.push(tempEerror);
        await this.storage.set('offlineArray', offlineArray);
        console.log('Cerification LogEvent Pushed in offlineArray');
      }

      if (this.logDaily) {
        this.logDaily.certified = true;
        this.logDaily.form.signatureId = this.signature;
        // this.logDaily.CertifyTimestamp = formatDate(
        //   new Date().toLocaleString('en-US', {
        //     timeZone: this.TimeZoneCity,
        //   }),
        //   'yyyy-MM-ddTHH:mm:ss',
        //   'en_US'
        // );
      }

      if (this.networkStatus === true) {
        this.dashboardService.updateLogDaily(this.logDaily as LogDailies).subscribe(
          response => {
            console.log(' LogDaily is on server:', response);
          },
          async error => {
            console.log('Internet Status' + this.networkStatus);
            let tempEerror = {
              url: 'api/EldDashboard/UploadLogDailies',
              body: this.logDaily,
            };
            let offlineArray = await this.storage.get('offlineArray');
            offlineArray.push(tempEerror);
            await this.storage.set('offlineArray', offlineArray);
            console.log(' LogDaily Pushed in offlineArray');
          }
        );
      } else {
        let tempEerror = {
          url: 'api/EldDashboard/UploadLogDailies',
          body: this.logDaily,
        };
        let offlineArray = await this.storage.get('offlineArray');
        offlineArray.push(tempEerror);
        await this.storage.set('offlineArray', offlineArray);
        console.log('Logdaily Pushed in offlineArray');
      }

      this.logEvents.push(CetificationLogEvent);
      const index = this.logDailies.findIndex(item => item.logDailyId === this.logDaily.logDailyId);
      if (index !== -1) {
        this.logDailies[index] = this.logDaily;
      }
      await this.storage.set('logDailies', this.logDailies);
      await this.storage.set('logEvents', this.logEvents);
    }
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      color: color,
    });
    toast.present();
  }

  nevigateToInspection() {
    this.navCtrl.navigateForward('/inspection-preview', { queryParams: { logId: this.logDaily.logDailyId, url: this.router.url } });
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
    this.networkSub.unsubscribe();
  }

  certifyLog() {
    this.navCtrl.navigateForward('log-certify', { queryParams: { url: this.router.url, date: this.logDaily.logDate } });
  }

  editLog() {
    this.navCtrl.navigateForward('edit-duty-status', { queryParams: { url: this.router.url } });
  }

  goBack() {
    this.navCtrl.navigateBack('unitab/hos');
  }
}
