import { formatDate } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Network } from '@capacitor/network';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
import SignaturePad from 'signature_pad';
import { LogDailies } from 'src/app/models/log-dailies';
import { LogEvents } from 'src/app/models/log-histories';
import { Vehicle } from 'src/app/models/vehicle';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-log-certify',
  templateUrl: './log-certify.page.html',
  styleUrls: ['./log-certify.page.scss'],
})
export class LogCertifyPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sPad', { static: false }) signaturePad!: ElementRef;

  signaturePadEl: SignaturePad;

  loading: boolean = false;

  logDate: string = '';
  logId: string = '';

  logDailies: LogDailies[] = [];

  logEvents: LogEvents[] = [];

  timeZones: { [key: string]: string } = {};

  timeZone: string = '';

  logDaily: LogDailies;

  vehicleId: string;

  signature: string = '';

  signatureFound: boolean = false;
  foundSignatureId: string = '';

  imageLoading: boolean = false;

  signatureLink: string = '';

  isConfirmButtonActive: boolean = false;

  signaturePadOptions: any = {
    minWidth: 2,
    maxWidth: 3,
    backgroundColor: '#FFFFFF',
    penColor: 'black',
  };

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private toastService: ToastService,
    private dashboardService: DashboardService,
    private storage: Storage,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.timeZones = this.utilityService.checkSeason();
    let timeZone$ = this.storage.get('timeZone');
    let queryParams$ = firstValueFrom(this.route.queryParams);
    let logDailies$ = firstValueFrom(this.databaseService.getLogDailies());
    let logEvents$ = firstValueFrom(this.databaseService.getLogEvents());
    let vehicleId$ = this.storage.get('vehicleId');

    forkJoin([queryParams$, timeZone$, logDailies$, logEvents$, vehicleId$]).subscribe(([queryParams, timeZone, logDailies, logEvents, vehicleId]) => {
      this.logDate = queryParams['date'];
      this.logId = queryParams['logId'];
      this.timeZone = timeZone;
      this.vehicleId = vehicleId;

      this.logDailies = logDailies;
      this.logDaily = this.logDailies.find(log => log.logDailyId === this.logId);
      this.logEvents = logEvents;
    });
  }

  ngAfterViewInit(): void {
    this.initSignaturePad();
  }

  ngOnDestroy(): void {}

  goBack() {
    this.navCtrl.navigateBack(['log-item', this.logId]);
  }

  initSignaturePad() {
    const driverSignatureCanvas: HTMLCanvasElement | null = this.signaturePad.nativeElement;

    if (driverSignatureCanvas) {
      this.signaturePadEl = new SignaturePad(driverSignatureCanvas, this.signaturePadOptions);
      driverSignatureCanvas.addEventListener('touchend', () => {
        this.updateSignatureField();
      });
    }
  }

  async restoreSignature() {
    const firstNonEmptySignature = this.logDailies.find(log => log.form.signatureId !== '' && log.form.signatureId !== '00000000-0000-0000-0000-000000000000');

    if (firstNonEmptySignature) {
      this.signature = '';
      this.signatureLink = firstNonEmptySignature.form.signatureLink;
      this.foundSignatureId = firstNonEmptySignature.form.signatureId;
      this.signatureFound = true;
      this.activateSave();
    } else {
      this.signatureFound = false;
      this.toastService.showToast('No signature found on other daily logs.');
    }
  }

  updateSignatureField() {
    if (this.signaturePad && !this.signaturePadEl.isEmpty()) {
      const signatureDataURL = this.signaturePadEl.toDataURL().slice(22);
      this.signature = signatureDataURL;
    } else {
      this.signature = '';
    }
    this.activateSave();
  }

  clearSignature() {
    if (this.signatureFound) {
      this.signatureFound = false;
    }
    if (this.signaturePad) {
      this.signaturePadEl.clear();
      this.signature = '';
    }
    this.isConfirmButtonActive = false;
  }

  async save() {
    this.loading = true;
    if (this.signatureFound) {
      this.logDaily.form.signatureId = this.foundSignatureId;
      this.logDaily.certified = true;
    } else {
      this.logDaily.form.signatureId = this.utilityService.uuidv4();
      this.logDaily.form.signature = this.signature;
      this.logDaily.certified = true;
    }

    const lastLogEvent = this.logEvents[this.logEvents.length - 1];

    let CetificationLogEvent: LogEvents = {
      logEventId: this.utilityService.uuidv4(),
      companyId: '',
      driverId: this.logDaily.driverId,
      eventTime: {
        logDate: formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]),
        timeStamp: new Date().getTime(),
        timeStampEnd: new Date().getTime(),
        timeZone: '',
      },
      vehicle: {
        vehicleId: this.vehicleId,
      },
      eld: {
        eldId: '00000000-0000-0000-0000-000000000000',
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

    let networkStatus = (await Network.getStatus()).connected;

    if (networkStatus) {
      this.dashboardService.updateLogDaily(this.logDaily as LogDailies).subscribe(
        async response => {
          this.toastService.showToast('Successfully signed the log certification.', 'success');
          this.loading = false;
          await this.updateIndexLogDaily(this.logDaily as LogDailies, true);
          this.goBack();
        },
        async error => {
          this.loading = false;
          this.toastService.showToast('Could not update the signture. Uploading offline only.');
          await this.updateIndexLogDaily(this.logDaily as LogDailies, false);
          this.goBack();
        }
      );

      this.dashboardService.updateLogEvent(CetificationLogEvent).subscribe(
        async response => {
          await this.updateLogEvents(CetificationLogEvent, true);
          console.log('Certification LogEvent is on server:', response);
        },
        async error => {
          console.log('Cerification LogEvent Pushed in offline logEvents array');
          await this.updateLogEvents(CetificationLogEvent, false);
        }
      );
    } else {
      console.log('Updated logEvents in offline array');
      await this.updateIndexLogDaily(this.logDaily as LogDailies, false);
      await this.updateLogEvents(CetificationLogEvent, false);
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

  activateSave() {
    if ((this.signature && this.signature.length !== 0) || (this.signatureLink && this.signatureLink.length !== 0)) this.isConfirmButtonActive = true;
    else this.isConfirmButtonActive = false;
  }

  imageLoaded() {
    this.imageLoading = false;
  }
}
