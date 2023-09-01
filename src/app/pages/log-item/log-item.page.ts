import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { InternetService } from 'src/app/services/internet.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Subscription, forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { LogDailies } from 'src/app/models/log-dailies';
import { LogHistories } from 'src/app/models/log-histories';
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
  logHistories: LogHistories[] = [];
  logDaily: any;
  currentDay: string = '';
  networkStatus = false;
  networkSub!: Subscription;
  graphicsHour = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];
  statusesOnDay: LogHistories[] = [];
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
    this.PickedVehicle = await this.storage.get('pickedVehicle');
    this.TimeZoneCity = await this.storage.get('TimeZoneCity');
    this.activatedRoute.paramMap.subscribe((params) => {
      this.LogDailiesId = params.get('logId');
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
    //     this.databaseService.getLogHistories().subscribe((logHistories) => {
    //       // const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];
    //       // this.logHistories = logHistories.filter((item) =>
    //       //   allSt.includes(item.EventTypeCode)
    //       // );
    //       this.logHistories = logHistories;
    //       this.logHistories.forEach((log) => {
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
    //       console.log(this.logHistories);
    //       this.drawGraph();
    //     });
    //   }
    // });

    this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
      if (ready) {
        this.bReady = ready;

        const logDailies$ = this.databaseService.getLogDailies();
        const logHistories$ = this.databaseService.getLogHistories();

        forkJoin([logDailies$, logHistories$]).subscribe(
          ([logDailies, logHistories]) => {
            this.logDailies = logDailies;
            this.logHistories = logHistories;

            this.logDaily = this.logDailies.find(
              (item) => item.LogDailiesId === this.LogDailiesId
            );
            if (this.logDaily) {
              console.log(this.logDaily);
              this.currentDay = this.logDaily.Day;
              this.fillFormWithLogDailyData();
            }
            this.logHistories.forEach((log) => {
              if (log.DateEnd === '0001-01-01T00:00:00') {
                log.DateEnd = formatDate(
                  new Date().toLocaleString('en-US', {
                    timeZone: this.TimeZoneCity,
                  }),
                  'yyyy-MM-ddTHH:mm:ss',
                  'en_US'
                );
              }
            });
            console.log(this.logHistories);
            console.log(this.logDaily);
            this.drawGraph();
            this.fillFormWithLogDailyData();
          }
        );
      }
    });

    this.networkSub = this.internetService.internetStatus$.subscribe(
      (status) => {
        this.networkStatus = status;
        console.log('Intenet Status' + status);
      }
    );
  }

  fillFormWithLogDailyData() {
    if (this.logDaily) {
      this.form.patchValue({
        Trailers: this.logDaily.Trailers || '',
        ShippingDocuments: this.logDaily.ShippingDoc || '',
        FromAdress: this.logDaily.FromAddress || '',
        ToAdress: this.logDaily.ToAddress || '',
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

    this.currentDay = this.logDaily.Day;

    this.logHistories.forEach((event) => {
      if (allSt.includes(event.EventTypeCode)) {
        sDateEnd = event.DateEnd;
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
          formatDate(new Date(event.DateBgn), 'yyyy-MM-dd', 'en_US') <=
            formatDate(new Date(this.currentDay), 'yyyy-MM-dd', 'en_US') &&
          formatDate(new Date(this.currentDay), 'yyyy-MM-dd', 'en_US') <=
            formatDate(new Date(sDateEnd), 'yyyy-MM-dd', 'en_US')
        ) {
          console.log('event', event);

          dateBgn = new Date(event.DateBgn);
          console.log(dateBgn.toLocaleDateString());
          console.log(new Date(this.currentDay).toLocaleDateString());
          if (
            dateBgn.toLocaleDateString() ===
            new Date(this.currentDay).toLocaleDateString()
          ) {
            this.xBgn = dateBgn.getHours() * 60 + dateBgn.getMinutes();
          } else {
            this.xBgn = 0;
          }

          console.log('X BEGIN =', this.xBgn);

          dateEnd = new Date(sDateEnd);

          if (
            dateEnd.toLocaleDateString() ===
            new Date(this.currentDay).toLocaleDateString()
          ) {
            this.xEnd = dateEnd.getHours() * 60 + dateEnd.getMinutes();
          } else {
            this.xEnd = 1440;
          }
          console.log('X END =', this.xEnd);

          switch (event.EventTypeCode) {
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

          switch (event.EventTypeCode) {
            case 'OFF':
              this.eventGraphicLine.push({
                x1: this.xBgn,
                y1: this.yBgn,
                x2: this.xEnd,
                y2: this.yEnd,
                yV: this.yBgnV,
                class: 'eventStatusOFF',
                name: '',
                historyId: event.LogHistoriesId,
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
                historyId: event.LogHistoriesId,
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
                historyId: event.LogHistoriesId,
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
                historyId: event.LogHistoriesId,
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
                historyId: event.LogHistoriesId,
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
                historyId: event.LogHistoriesId,
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
    const currentIndex = this.logDailies.findIndex(
      (item) => item.LogDailiesId === this.logDaily.LogDailiesId
    );
    const nextIndex = currentIndex + 1;

    if (nextIndex < this.logDailies.length) {
      this.logDaily = this.logDailies[nextIndex];
      this.fillFormWithLogDailyData();
      this.drawGraph();
    }
  }

  goToPreviousLog() {
    const currentIndex = this.logDailies.findIndex(
      (item) => item.LogDailiesId === this.logDaily.LogDailiesId
    );
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      this.logDaily = this.logDailies[previousIndex];
      this.fillFormWithLogDailyData();
      this.drawGraph();
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      this.logDaily.Vehicles = this.form.value.Vehicles;
      this.logDaily.Trailers = this.form.value.Trailers;
      this.logDaily.ShippingDoc = this.form.value.ShippingDocuments;
      this.logDaily.FromAddress = this.form.value.FromAdress;
      this.logDaily.ToAddress = this.form.value.ToAdress;
      this.logDaily.FormManner = true;

      if (this.networkStatus === true) {
        this.dashboardService.updateLogDaily(this.logDaily).subscribe(
          (response) => {
            console.log(
              `LogDaily ${this.logDaily} is updated on server:`,
              response
            );
          },
          async (error) => {
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
      const index = this.logDailies.findIndex(
        (item) => item.LogDailiesId === this.logDaily.LogDailiesId
      );
      if (index !== -1) {
        this.logDailies[index] = this.logDaily;
      }
      await this.storage.set('logDailies', this.logDailies);
      this.presentToast('Saved successfully!');
    }
  }

  initSignaturePad() {
    const driverSignatureCanvas: HTMLCanvasElement | null =
      this.signaturePadElement.nativeElement;
    if (driverSignatureCanvas) {
      this.signaturePad = new SignaturePad(
        driverSignatureCanvas,
        this.signaturePadOptions
      );
      driverSignatureCanvas.addEventListener('touchend', () => {
        this.updateSignatureField();
      });
    }
  }

  restoreSignature() {
    const firstNonEmptySignature = this.logDailies.find(
      (log) => log.Signature !== ''
    );

    if (firstNonEmptySignature) {
      this.renderSignature(firstNonEmptySignature.Signature);
    }
  }

  renderSignature(signatureData: string) {
    const canvas: HTMLCanvasElement | null =
      this.signaturePadElement.nativeElement;

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
      const lastLogHistory = this.logHistories[this.logHistories.length - 1];
      let CetificationLogHistory = {
        City: '',
        CoDriverId: '',
        Comment: '',
        CountryCode: '',
        CertificationDay: this.logDaily.Day,
        DataDiagnosticEvent: false,
        DateBgn: formatDate(
          new Date().toLocaleString('en-US', {
            timeZone: this.TimeZoneCity,
          }),
          'yyyy-MM-ddTHH:mm:ss',
          'en_US'
        ),
        DateEnd: formatDate(
          new Date().toLocaleString('en-US', {
            timeZone: this.TimeZoneCity,
          }),
          'yyyy-MM-ddTHH:mm:ss',
          'en_US'
        ),
        DistanceSince: 0,
        DriverId: this.driverId,
        ELDId: '00000000-0000-0000-0000-000000000000',
        EngineHours: 0,
        EventDataCheck: '',
        EventRecordOriginCode: 'DRIVER',
        EventRecordOriginName: 'Driver',
        EventRecordStatusCode: 'ACTIVE',
        EventRecordStatusName: 'Active',
        EventSequenceNumber: lastLogHistory
          ? lastLogHistory.EventSequenceNumber + 1
          : 1,
        EventTypeCode: 'CERTIFICATION_1',
        EventTypeName: 'Certification (1)',
        EventTypeType: 'DRIVER_CERTIFICATION',
        Latitude: 0,
        LocationDescription: '2mi from Chisinau, Chisinau',
        LocationDescriptionManual: '',
        LocationSourceCode: 'AUTOMATIC',
        LocationSourceName: 'Location generated when connected to ECM',
        LogDailiesId: '',
        LogHistoriesId: this.uuidv4(),
        Longitude: 0,
        Malfunction: false,
        Odometer: 0,
        PositioningCode: 'AUTOMATIC',
        PositioningName: 'Automatic',
        SendLogToInspector: false,
        StateProvinceCode: '',
        VehicleId: this.vehicleId,
      };

      if (this.networkStatus === true) {
        this.dashboardService
          .updateLogHistory(CetificationLogHistory)
          .subscribe(
            (response) => {
              console.log('Certification LogHistory is on server:', response);
            },
            async (error) => {
              console.log('Internet Status' + this.networkStatus);
              let tempEerror = {
                url: 'api/EldDashboard/UploadLogHistories',
                body: CetificationLogHistory,
              };
              let offlineArray = await this.storage.get('offlineArray');
              offlineArray.push(tempEerror);
              await this.storage.set('offlineArray', offlineArray);
              console.log('Cerification LogHistory Pushed in offlineArray');
            }
          );
      } else {
        let tempEerror = {
          url: 'api/EldDashboard/UploadLogHistories',
          body: CetificationLogHistory,
        };
        let offlineArray = await this.storage.get('offlineArray');
        offlineArray.push(tempEerror);
        await this.storage.set('offlineArray', offlineArray);
        console.log('Cerification LogHistory Pushed in offlineArray');
      }

      this.logDaily.Certified = true;
      this.logDaily.Signature = this.signature;
      this.logDaily.CertifyTimestamp = formatDate(
        new Date().toLocaleString('en-US', {
          timeZone: this.TimeZoneCity,
        }),
        'yyyy-MM-ddTHH:mm:ss',
        'en_US'
      );

      if (this.networkStatus === true) {
        this.dashboardService.updateLogDaily(this.logDaily).subscribe(
          (response) => {
            console.log(' LogDaily is on server:', response);
          },
          async (error) => {
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

      this.logHistories.push(CetificationLogHistory);
      const index = this.logDailies.findIndex(
        (item) => item.LogDailiesId === this.logDaily.LogDailiesId
      );
      if (index !== -1) {
        this.logDailies[index] = this.logDaily;
      }
      await this.storage.set('logDailies', this.logDailies);
      await this.storage.set('logHistories', this.logHistories);
    }
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
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
    this.navCtrl.navigateForward([
      '/inspection-preview',
      { logId: this.logDaily.LogDailiesId },
    ]);
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
    this.networkSub.unsubscribe();
  }
}
