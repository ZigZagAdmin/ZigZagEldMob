import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { NavController } from '@ionic/angular';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
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
import { LocationService } from 'src/app/services/location.service';
import { Network } from '@capacitor/network';
import { InterService } from 'src/app/services/inter.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-insert-dvir',
  templateUrl: './insert-dvir.page.html',
  styleUrls: ['./insert-dvir.page.scss'],
})
export class InsertDvirPage implements OnInit, OnDestroy, AfterViewInit {
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
  locationLoading: boolean = false;
  vehicleUnitDisable: boolean = false;

  lastStatus: string = '';
  optionDisable: boolean = true;

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
    private toastService: ToastService,
    private locationService: LocationService,
    private interService: InterService
  ) {}

  async ngOnInit() {
    this.dvir.status.name = 'Vehicle Condition Satisfactory';
    this.dvir.status.code = 'VCS';
    this.dvir.defectsVehicle = '';
    this.dvir.defectsTrailers = '';

    let company$ = firstValueFrom(this.databaseService.getCompany());
    let dvirs$ = firstValueFrom(this.databaseService.getDvirs());
    let vehicleUnit$ = this.storage.get('vehicleUnit');
    let vehicleId$ = this.storage.get('vehicleId');
    let driverId$ = this.storage.get('driverId');

    forkJoin([company$, dvirs$, vehicleUnit$, vehicleId$, driverId$]).subscribe(([company, dvirs, vehicleUnit, vehicleId, driverId]) => {
      this.company = company;
      this.dvirs = dvirs;
      this.vehicleUnit = vehicleUnit;
      this.vehicleUnitDisable = !!this.vehicleUnit;
      this.vehicleId = vehicleId;
      this.driverId = driverId;
    });

    await this.getLocalCurrentLocation();
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
      this.dvir.location = res;
      this.locationLoading = false;
      if (this.dvir.location.locationType === 'AUTOMATIC') {
        this.locationDisable = true;
      } else {
        this.locationDisable = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.shareService.destroyMessage();
  }

  ngAfterViewInit(): void {
    this.initSignaturePad();
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
    let networkStatus = await Network.getStatus();
    this.shareService.changeMessage('reset');
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

    this.loading = true;
    if (networkStatus.connected === true) {
      this.dashboardService
        .updateDVIR(this.dvir)
        .toPromise()
        .then(async (response: any) => {
          if (response.signatureLink) this.dvir.signatureLink = response.signatureLink;
          await this.updateDvirs(this.dvir, true).then(() => {
            console.log('DVIRs got updated on the server: ', response);
            this.loading = false;
            setTimeout(() => this.goBack(), 0);
          });
        })
        .catch(async error => {
          await this.updateDvirs(this.dvir, false).then(() => {
            this.loading = false;
            setTimeout(() => {
              this.goBack();
            }, 0);
            console.warn('Server Error: ', error);
            console.warn('Pushed dvirs in offline mode');
          });
        });
    } else {
      await this.updateDvirs(this.dvir, false).then(() => {
        this.loading = false;
        setTimeout(() => this.goBack(), 0);
        console.warn('Pushed dvirs in offline mode');
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
  }

  goBack() {
    this.interService.changeMessage({ topic: 'dvir' });
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
