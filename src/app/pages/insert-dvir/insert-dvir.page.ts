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
import { ManageService } from 'src/app/services/manage.service';

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

  imageLoading: boolean = false;

  dvir: DVIRs = {
    dvirId: this.utilityService.uuidv4(),
    driver: {
      driverId: '',
    },
    vehicle: {
      vehicleUnit: '',
      vehicleId: '',
    },
    odometer: 0,
    trailers: '',
    defectsVehicle: '',
    defectsTrailers: '',
    remarks: '',
    status: { code: '', name: '' },
    location: {
      description: '',
      latitude: 0,
      longitude: 0,
    },
    createDate: new Date(formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en-US')).getTime(),
    createTimeZone: '',
    repairDate: 0,
    repairTimeZone: '',

    signatureId: this.utilityService.uuidv4(),
    signatureBase64: '',
    signatureLink: '',
  };

  validation: { [key: string]: boolean } = {
    trailerName: false,
    locationDescription: false,
  };

  locationDisable: boolean = false;
  vehicleUnitDisable: boolean = false;

  lastStatus: string = '';
  optionDisable: boolean = false;

  loading: boolean = false;
  signatureFound: boolean = false;

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
    this.dvir.status.name = 'Vehicle Condition Satisfactory';
    this.dvir.status.code = 'VCS';
    this.dvir.defectsVehicle = '';
    this.dvir.defectsTrailers = '';

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
    this.vehicleUnitDisable = !!this.vehicleUnit;
    this.vehicleId = await this.storage.get('vehicleId');
    this.driverId = await this.storage.get('driverId');

    this.networkSub = this.internetService.internetStatus$.subscribe(status => {
      this.networkStatus = status;
      console.log('Intenet Status' + status);
    });
  }

  ngOnDestroy(): void {
    this.shareService.destroyMessage();
  }

  checkSelectPresent(data: any) {
    if (this.dvir.defectsTrailers === '' && this.dvir.defectsVehicle === '') {
      this.switchStatus('VCS');
    } else {
      this.switchStatus('D');
    }
  }

  switchStatus(status: string) {
    if (status.length !== 0 && status !== this.lastStatus) {
      console.log(status);
      this.lastStatus = status;
      this.dvir.status.code = status;
      this.dvir.status.name = dvirStatuses.find(el => el.code === status).name;
    }
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
      this.dvir.signatureBase64 = signatureDataURL;
    } else {
      this.dvir.signatureBase64 = '';
    }
  }

  async restoreSignature() {
    const firstNonEmptySignature = this.dvirs.find(dvir => dvir.signatureId !== '' && dvir.signatureId !== '00000000-0000-0000-0000-000000000000' && dvir.signatureLink !== '');

    if (firstNonEmptySignature) {
      this.dvir.signatureBase64 = '';
      this.dvir.signatureLink = firstNonEmptySignature.signatureLink;
      this.dvir.signatureId = firstNonEmptySignature.signatureId;
      console.log(firstNonEmptySignature);
      this.signatureFound = true;
    } else {
      this.signatureFound = false;
      this.toastService.showToast('No signature found on other daily logs.');
    }
  }

  clearSignature() {
    if (this.signatureFound) {
      this.signatureFound = false;
      this.dvir.signatureLink = '';
    }
    if (this.signaturePad) {
      this.signaturePad.clear();
      this.dvir.signatureBase64 = '';
    }
  }

  imageLoaded() {
    this.imageLoading = false;
  }

  async onSubmit() {
    if (this.dvir.defectsTrailers.length === 0) this.validation['trailerName'] = true;
    this.shareService.changeMessage(this.utilityService.generateString(5));
    if (!this.utilityService.validateForm(this.validation)) return;
    if (this.dvir.signatureBase64.length === 0 && this.dvir.signatureLink.length === 0) {
      this.toastService.showToast('Please sign the form before saving!');
      return;
    }

    this.dvir.vehicle.vehicleUnit = this.vehicleUnit;
    this.dvir.vehicle.vehicleId = this.vehicleId;
    this.dvir.driver.driverId = this.driverId;

    console.log('here');

    if (this.networkStatus === true) {
      this.loading = true;
      this.dashboardService
        .updateDVIR(this.dvir)
        .toPromise()
        .then(async response => {
          await this.updateDvirs(this.dvir, true).then(() => {
            console.log('DVIRs got updated on the server: ', response);
            this.loading = false;
            this.navCtrl.navigateBack('/unitab/dvir');
          });
        })
        .catch(async error => {
          await this.updateDvirs(this.dvir, false).then(() => {
            this.loading = false;
            this.navCtrl.navigateBack('/unitab/dvir');
            console.warn('Server Error: ', error);
            console.warn('Pushed dvirs in offline mode');
          });
        });
    } else {
      await this.updateDvirs(this.dvir, false).then(() => {
        this.loading = false;
        console.warn('Pushed dvirs in offline mode');
        this.navCtrl.navigateBack('/unitab/dvir');
      });
    }
  }

  async updateDvirs(dvirData: DVIRs, online: boolean) {
    dvirData.sent = online;
    this.dvirs.unshift(dvirData);
    await this.storage.set('dvirs', this.dvirs);
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
