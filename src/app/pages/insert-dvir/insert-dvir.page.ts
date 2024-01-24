import { Component, OnDestroy, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';
import SignaturePad from 'signature_pad';

import { DatabaseService } from 'src/app/services/database.service';
import { Company } from 'src/app/models/company';
import { DVIRs } from 'src/app/models/dvirs';
import { DashboardService } from 'src/app/services/dashboard.service';
import { InternetService } from 'src/app/services/internet.service';
import { defectsVehicle, defectsTrailers, dvirStatuses } from 'src/app/utilities/defects';
import { UtilityService } from 'src/app/services/utility.service';
import { ShareService } from 'src/app/services/share.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-insert-dvir',
  templateUrl: './insert-dvir.page.html',
  styleUrls: ['./insert-dvir.page.scss'],
})
export class InsertDvirPage implements OnInit, OnDestroy {
  defectsVehicle = defectsVehicle;
  defectsTrailers = defectsTrailers;

  signaturePadOptions: any = {
    minWidth: 2,
    maxWidth: 3,
    backgroundColor: '#FFFFFF',
    penColor: 'black',
  };
  DvirId: string = '';
  signaturePad!: SignaturePad;
  databaseSubscription: Subscription | undefined;
  company: Company | undefined;
  dvirs: DVIRs[] = [];
  bReady: boolean = false;
  vehicleUnit: string = '';
  vehicleId: string = '';
  driverId: string = '';
  statusIcon = 'checkmark-circle-outline';
  networkStatus = false;
  networkSub!: Subscription;
  Date: string;

  dvir: Partial<DVIRs> = {
    createDate: new Date().getTime(),
    location: {
      description: '',
      latitude: 0,
      longitude: 0,
    },
    vehicle: {
      vehicleUnit: '',
    },
    trailers: '',
    odometer: 0,
    defectsVehicle: '',
    defectsTrailers: '',
    remarks: '',
    status: {
      name: '',
      code: '',
    },
    comments: '',
    signatureId: this.utilityService.uuidv4(),
    signatureBase64: '',
  };

  validation: { [key: string]: boolean } = {
    trailerName: false,
    locationDescription: false,
  };

  constructor(
    private databaseService: DatabaseService,
    private storage: Storage,
    private dashboardService: DashboardService,
    private internetService: InternetService,
    private navCtrl: NavController,
    private utilityService: UtilityService,
    private shareService: ShareService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    this.initSignaturePad();
    this.databaseSubscription = this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
      if (ready) {
        this.bReady = ready;
        this.databaseService.getCompany().subscribe(company => {
          this.company = company;
        });
        this.databaseService.getDvirs().subscribe(dvirs => {
          this.dvirs = dvirs;
        });
      }
    });

    this.vehicleUnit = await this.storage.get('vehicleUnit');
    this.vehicleId = await this.storage.get('vehicleId');
    this.driverId = await this.storage.get('driverId');

    this.dvir.status.name = 'Vehicle Condition Satisfactory';
    this.dvir.status.code = 'VCS';

    this.networkSub = this.internetService.internetStatus$.subscribe(status => {
      this.networkStatus = status;
      console.log('Intenet Status' + status);
    });
  }

  ngOnDestroy(): void {
    this.shareService.destroyMessage();
  }

  switchStatus(status: string) {
    console.log(status);
    this.dvir.status.code = status;
    this.dvir.status.name = dvirStatuses.find(el => el.code === status).name;
  }

  isStatusDisabled(statusToDisable: string): boolean {
    const defectsVehicle = this.dvir.defectsVehicle || '';
    const defectsTrailers = this.dvir.defectsTrailers || '';
    const hasDefects = defectsVehicle.length > 0 || defectsTrailers.length > 0;
    if (hasDefects) {
      return statusToDisable === 'VCS';
    }
    return statusToDisable === 'D';
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  initSignaturePad() {
    const canvas: HTMLCanvasElement | null = document.querySelector('canvas');
    if (canvas) {
      this.signaturePad = new SignaturePad(canvas, this.signaturePadOptions);
      canvas.addEventListener('touchend', () => {
        this.updateSignatureField();
      });
    }
  }

  updateSignatureField() {
    if (this.signaturePad && !this.signaturePad.isEmpty()) {
      const signatureDataURL = this.signaturePad.toDataURL().slice(22);
      // this.form.patchValue({ Signature: signatureDataURL });
      this.dvir.signatureBase64 = signatureDataURL;
    } else {
      // this.form.patchValue({ Signature: '' });
      this.dvir.signatureBase64 = '';
    }
  }

  clearSignature() {
    if (this.signaturePad) {
      this.signaturePad.clear();
      // this.form.patchValue({ Signature: '' });
      this.dvir.signatureBase64 = '';
    }
  }

  async onSubmit() {
    // if (this.form.valid) {
    this.shareService.changeMessage(this.utilityService.generateString(5));
    if (!this.utilityService.validateForm(this.validation)) return;

    const dvirData: DVIRs = {
      dvirId: this.uuidv4(),
      driver: {
        driverId: this.driverId,
      },
      vehicle: {
        vehicleUnit: this.vehicleUnit,
        vehicleId: this.vehicleId,
      },
      odometer: this.dvir.odometer,
      trailers: this.dvir.trailers,
      defectsVehicle: this.dvir.defectsVehicle,
      defectsTrailers: this.dvir.defectsTrailers,
      remarks: this.dvir.remarks || '',
      status: { code: this.dvir.status.code, name: this.dvir.status.name },
      location: {
        description: this.dvir.location.description,
        latitude: 0,
        longitude: 0,
      },
      createDate: new Date(formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en-US')).getTime(),
      createTimeZone: '',
      repairDate: 0,
      repairTimeZone: '',

      signatureId: this.uuidv4(),
      signatureBase64: this.dvir.signatureBase64,
    };

    if (this.networkStatus === true) {
      this.dashboardService.updateDVIR(dvirData).subscribe(
        async response => {
          console.log('DVIRs got updated on the server: ', response);
          await this.updateDvirs(dvirData, true);
        },
        async error => {
          this.updateDvirs(dvirData, false);
          console.warn('Server Error: ', error);
          await console.warn('Pushed dvirs in offline mode');
        }
      );
    } else {
      await this.updateDvirs(dvirData, false);
      console.warn('Pushed dvirs in offline mode');
    }

    this.dvirs.unshift(dvirData);
    await this.storage.set('dvirs', this.dvirs);
    this.navCtrl.navigateBack('/unitab/dvir');
    // }
  }

  async updateDvirs(dvirData: DVIRs, online: boolean) {
    dvirData.sent = online;
    this.dvirs.push(dvirData);
    await this.storage.set('dvirs', this.dvirs);
    this.navCtrl.navigateBack('/unitab/dvir');
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
    this.networkSub.unsubscribe();
  }

  goBack() {
    this.navCtrl.navigateBack('/unitab/dvir');
    this.shareService.destroyMessage();
  }

  getHour(value: number) {
    return formatDate(value, "LLL d'th', yyyy", 'en_US');
  }

  getTime(value: number) {
    return formatDate(value, 'hh:mm a', 'en_US');
  }
}
