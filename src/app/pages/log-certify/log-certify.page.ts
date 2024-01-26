import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import SignaturePad from 'signature_pad';
import { LogDailies } from 'src/app/models/log-dailies';
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

  logDailies: LogDailies[];

  logDaily: LogDailies;

  logDailies$: Subscription;

  signature: string = '';

  routeSubscription: Subscription;

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
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.logDate = params['date'];
      this.logId = params['logId'];
    });
    this.logDailies$ = this.databaseService.getLogDailies().subscribe(logDailies => {
      this.logDailies = logDailies;
      this.logDaily = this.logDailies.find(log => log.logDailyId === this.logId);
      console.log(this.logDaily);
    });
  }

  ngAfterViewInit(): void {
    this.initSignaturePad();
  }

  ngOnDestroy(): void {
    this.logDailies$.unsubscribe();
  }

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
      console.log(firstNonEmptySignature);
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

  save() {
    this.loading = true;
    if (this.signatureFound) {
      this.logDaily.form.signatureId = this.foundSignatureId;
      this.logDaily.certified = true;
    } else {
      this.logDaily.form.signatureId = this.utilityService.uuidv4();
      this.logDaily.form.signature = this.signature;
      this.logDaily.certified = true;
    }
    this.dashboardService.updateLogDaily(this.logDaily as LogDailies).subscribe(
      response => {
        this.toastService.showToast('Successfully signed the log certification.', 'success');
        this.loading = false;
        this.updateLocalStorage();
        this.goBack();
      },
      async error => {
        this.loading = false;
        this.toastService.showToast('Could not update the signture. Uploading offline only.');
        this.updateLocalStorage();
        this.goBack();
      }
    );
  }

  activateSave() {
    if ((this.signature && this.signature.length !== 0) || (this.signatureLink && this.signatureLink.length !== 0)) this.isConfirmButtonActive = true;
    else this.isConfirmButtonActive = false;
  }

  imageLoaded() {
    this.imageLoading = false;
  }

  async updateLocalStorage() {
    let offlineLogDailies = await this.storage.get('logDailies');
    let index = offlineLogDailies.findIndex((el: LogDailies) => el.logDailyId === this.logDaily.logDailyId);
    offlineLogDailies.splice(index, 1, this.logDaily);
    await this.storage.set('logDailies', offlineLogDailies);
    console.log('log-certify: logDailies updated in the storage');
  }
}
