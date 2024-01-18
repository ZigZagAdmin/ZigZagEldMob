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

  backUrl: string = '';
  logDate: string = '';
  logId: string = '';

  logDailies: LogDailies[];

  logDaily: LogDailies;

  logDailies$: Subscription;

  signature: string = '';

  routeSubscription: Subscription;

  signatureFound: boolean = false;

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
      this.backUrl = params['url'];
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
    this.navCtrl.navigateBack(this.backUrl);
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
      this.signatureLink = firstNonEmptySignature.form.signatureLink;
      this.signatureFound = true;
    } else {
      this.signatureFound = false;
      this.toastService.showToast('No signature found on other daily logs.');
    }
  }

  renderSignature(signatureData: string) {
    const canvas: HTMLCanvasElement | null = this.signaturePad.nativeElement;

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
    if (this.signaturePad && !this.signaturePadEl.isEmpty()) {
      const signatureDataURL = this.signaturePadEl.toDataURL().slice(22);
      this.signature = signatureDataURL;
    } else {
      this.signature = '';
    }
    this.logDaily.form.signatureId = this.utilityService.uuidv4();
    this.logDaily.form.signature = this.signature;
    this.logDaily.certified = true;
    this.activateSave();
  }

  clearSignature() {
    console.log('clear');
    if (this.signaturePad) {
      this.signaturePadEl.clear();
      this.signature = '';
    }
    this.isConfirmButtonActive = false;
  }

  save() {
    this.loading = true;
    this.dashboardService.updateLogDaily(this.logDaily as LogDailies).subscribe(
      response => {
        console.log(`LogDaily ${this.logDaily} is updated on server:`, response);
        this.toastService.showToast('Successfully sign the log certification.', 'success');
        this.loading = false;
        this.goBack();
      },
      async error => {
        this.loading = false;
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
  }

  activateSave() {
    if (this.signature.length !== 0) this.isConfirmButtonActive = true;
    else this.isConfirmButtonActive = false;
  }
}
