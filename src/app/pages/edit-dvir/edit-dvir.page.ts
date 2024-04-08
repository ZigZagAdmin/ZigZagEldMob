import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { InternetService } from 'src/app/services/internet.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Company } from 'src/app/models/company';
import { DVIRs } from 'src/app/models/dvirs';
import SignaturePad from 'signature_pad';
import { ShareService } from 'src/app/services/share.service';
import { defectsVehicle, dvirStatuses } from 'src/app/utilities/defects';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilityService } from 'src/app/services/utility.service';
import { InterService } from 'src/app/services/inter.service';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';
import { LocationService } from 'src/app/services/location.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-dvir',
  templateUrl: './edit-dvir.page.html',
  styleUrls: ['./edit-dvir.page.scss'],
})
export class EditDvirPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sPad', { static: false }) signaturePadElement: ElementRef;
  @ViewChild('mechanicSPad', { static: false }) mechanicSignaturePadElement: ElementRef;

  defectsVehicle = defectsVehicle;
  defectsTrailers = defectsVehicle;
  DvirStatuses = [
    { StatusCode: 'VCS', StatusName: 'Vehicle Condition Satisfactory' },
    { StatusCode: 'D', StatusName: 'Has Defects' },
    { StatusCode: 'DC', StatusName: 'Defects Corrected' },
    {
      StatusCode: 'DNNBC',
      StatusName: 'Defects Need Not Be Corrected',
    },
  ];
  signaturePadOptions: any = {
    minWidth: 2,
    maxWidth: 3,
    backgroundColor: '#FFFFFF',
    penColor: 'black',
  };

  databaseSubscription: Subscription | undefined;
  signaturePad!: SignaturePad;
  mechanicSignaturePad!: SignaturePad | null;
  company: Company | undefined;
  dvirs: DVIRs[] = [];
  dvir: DVIRs;
  bReady: boolean = false;
  pickedVehicle: string = '';
  vehicleId: string = '';
  driverId: string = '';
  dvirId!: string | null;

  validation: { [key: string]: boolean } = {
    trailerName: false,
    locationDescription: false,
  };

  locationDisable: boolean = false;
  vehicleUnitDisable: boolean = false;

  lastStatus: string = '';
  optionDisable: boolean = true;

  loading: boolean = false;

  pageLoading: boolean = false;

  signatureFound: boolean = false;
  signatureRestored: boolean = false;
  imageLoading: boolean = false;
  finishedLoading: boolean = false;

  mechanicSignatureFound: boolean = false;
  mechanicSignatureRestored: boolean = false;
  mechanicImageLoading: boolean = false;
  mechanicFinishedLoading: boolean = false;

  today = new Date();
  timeZone: string = '';

  locationLoading: boolean = false;

  timeZones: { [key: string]: string } = {};
  oldSignatureLink: string = '';
  oldSignatureId: string = '';

  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private dashboardService: DashboardService,
    private databaseService: DatabaseService,
    private internetService: InternetService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private shareService: ShareService,
    private toastService: ToastService,
    private utilityService: UtilityService,
    private interService: InterService,
    private locationService: LocationService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.pageLoading = true;
    this.imageLoading = true;
    this.mechanicImageLoading = true;
    this.timeZones = this.utilityService.checkSeason();

    let dvirId$ = firstValueFrom(this.activatedRoute.queryParams);
    let company$ = firstValueFrom(this.databaseService.getCompany());
    let dvirs$ = firstValueFrom(this.databaseService.getDvirs());
    let timeZone$ = this.storage.get('timeZone');

    forkJoin([company$, dvirs$, dvirId$, timeZone$]).subscribe(
      ([company, dvirs, params, timeZone]) => {
        this.dvirId = params['dvirId'];
        this.company = company;
        this.dvirs = dvirs;
        this.timeZone = timeZone;
        this.dvir = this.dvirs.find(item => item.dvirId === this.dvirId);
        this.oldSignatureLink = this.dvir.signatureLink;
        this.oldSignatureId = this.dvir.signatureId;
        console.log(this.dvir);
        if (!(this.dvir.signatureBase64 && this.dvir.signatureBase64.length !== 0)) this.dvir.signatureBase64 = '';
        if (!(this.dvir.mechanicSignatureBase64 && this.dvir.mechanicSignatureBase64.length !== 0)) this.dvir.mechanicSignatureBase64 = '';
        if (!(this.dvir.mechanicSignatureLink && this.dvir.mechanicSignatureLink.length !== 0)) this.dvir.mechanicSignatureLink = '';
        this.locationDisable = !!this.dvir.location.description;
        this.vehicleUnitDisable = !!this.dvir.vehicle.vehicleUnit;
        this.pageLoading = false;
      },
      error => console.log(error)
    );
    this.signatureTimeout();
    this.mechanicSignatureTimeout();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.resizeCanvas();
      this.resizeMechCanvas();
    }, 100);
  }

  ionViewDidEnter(): void {
    this.initSignaturePad();
    this.initMechanicalSignaturePad();
  }

  ngOnDestroy(): void {}

  async getLocalCurrentLocation() {
    this.locationLoading = true;
    let locationStatus = await this.storage.get('locationStatus');
    if (Capacitor.getPlatform() !== 'web') {
      if (!locationStatus) {
        this.toastService.showToast(this.translate.instant('Problems fetching location! Check the location service!'), 'danger', 2500);
      }
    }
    await this.locationService.getCurrentLocation().then(res => {
      let oldLocation = this.dvir.location;
      this.dvir.location = res;
      this.locationLoading = false;
      if (this.dvir.location.locationType === 'AUTOMATIC') {
        this.locationDisable = true;
      } else {
        this.locationDisable = false;
        this.dvir.location = oldLocation;
      }
    });
  }

  switchStatus(status: string) {
    if (status.length !== 0 && status !== this.lastStatus) {
      this.lastStatus = status;
      this.dvir.status.code = status;
      this.dvir.status.name = dvirStatuses.find(el => el.code === status).name;
    }
    if (!(this.dvir.mechanicSignatureId && this.dvir.mechanicSignatureId.length !== 0)) {
      this.dvir.mechanicSignatureId = '00000000-0000-0000-0000-000000000000';
      this.dvir.mechanicSignatureBase64 = '';
      this.clearMechanicSignature();
    }
    if (this.dvir.status.code === 'DC' && this.mechanicSignaturePad) {
      this.initMechanicalSignaturePad();
      setTimeout(() => this.resizeMechCanvas(), 100);
    }
  }

  imageLoaded() {
    this.imageLoading = false;
    this.finishedLoading = true;
  }

  mechanicImageLoaded() {
    this.mechanicImageLoading = false;
    this.mechanicFinishedLoading = true;
  }

  signatureTimeout() {
    setTimeout(() => {
      if (!this.finishedLoading && this.dvir.signatureLink && this.dvir.signatureLink.length !== 0) {
        this.imageLoading = false;
        this.signatureRestored = false;
        this.clearSignature();
      }
    }, 5000);
  }

  mechanicSignatureTimeout() {
    setTimeout(() => {
      if (!this.mechanicFinishedLoading && this.dvir.mechanicSignatureLink && this.dvir.mechanicSignatureLink.length !== 0) {
        this.mechanicImageLoading = false;
        this.mechanicSignatureRestored = false;
        this.clearMechanicSignature();
      }
    }, 5000);
  }

  checkSelectPresent(data: any) {
    if (this.dvir.status.code !== 'DC' && this.dvir.status.code !== 'DNNBC') {
      if (this.dvir.defectsTrailers === '' && this.dvir.defectsVehicle === '') {
        this.switchStatus('VCS');
      } else {
        this.switchStatus('D');
      }
    }
  }

  navigateBack() {
    this.router.navigate(['/unitab/dvir']);
  }

  async onSubmit() {
    this.shareService.changeMessage('reset');
    if (this.dvir.defectsTrailers.length === 0) this.validation['trailerName'] = true;
    this.shareService.changeMessage(this.utilityService.generateString(5));
    if (!this.utilityService.validateForm(this.validation)) return;
    if (this.dvir.status.code === 'D' && this.dvir.defectsTrailers.length === 0 && this.dvir.defectsVehicle.length === 0) {
      this.toastService.showToast(this.translate.instant('You cannot select "Has Defects" without selecting any defect!'));
      return;
    }
    if (this.dvir.signatureBase64.length === 0 && this.dvir.signatureLink.length === 0) {
      this.toastService.showToast(this.translate.instant('Please sign the form before saving!'));
      return;
    }
    if (this.dvir.status.code === 'DC') this.dvir.mechanicSignatureId = this.utilityService.uuidv4();
    if (this.dvir.status.code === 'DC' && this.dvir.mechanicSignatureBase64.length === 0 && this.dvir.mechanicSignatureLink.length === 0) {
      this.toastService.showToast(this.translate.instant('Please complete the mechanic signature!'));
      return;
    }
    let networkStatus = await Network.getStatus();
    if (networkStatus.connected === true) {
      this.loading = true;
      this.dashboardService
        .updateDVIR(this.dvir)
        .toPromise()
        .then(async (response: any) => {
          if (response.signatureLink) this.dvir.signatureLink = response.signatureLink;
          if (response.mechanicSignatureLink) this.dvir.mechanicSignatureLink = response.mechanicSignatureLink;
          await this.updateDvirs(this.dvir, true).then(() => {
            console.log('DVIRs got updated on the server: ', response);
            this.loading = false;
            this.goBack();
          });
        })
        .catch(async error => {
          await this.updateDvirs(this.dvir, false).then(() => {
            this.loading = false;
            this.goBack();
            console.warn('Server Error: ', error);
            console.warn('Pushed dvirs in offline mode');
          });
        });
    } else {
      await this.updateDvirs(this.dvir, false).then(() => {
        this.loading = false;
        console.warn('Pushed dvirs in offline mode');
        this.goBack();
      });
    }
  }

  async updateDvirs(dvirData: DVIRs, online: boolean) {
    dvirData.sent = online;
    let index = this.dvirs.findIndex(item => item.dvirId === dvirData.dvirId);
    if (index !== -1) {
      this.dvirs[index] = dvirData;
    }
    await this.storage.set('dvirs', this.dvirs);
    this.navCtrl.navigateBack('/unitab/dvir');
  }

  initSignaturePad() {
    const driverSignatureCanvas: HTMLCanvasElement | null = this.signaturePadElement.nativeElement;

    if (driverSignatureCanvas) {
      this.signaturePad = new SignaturePad(driverSignatureCanvas, this.signaturePadOptions);
      driverSignatureCanvas.addEventListener('touchend', () => {
        this.updateSignatureField();
      });

      // if (this.dvir && this.dvir.signatureBase64) {
      //   this.renderSignature('data:image/png;base64,' + this.dvir.signatureBase64);
      // }
    }
    if (this.dvir.signatureLink && this.dvir.signatureLink.length !== 0) {
      this.signatureFound = true;
    }
  }

  initMechanicalSignaturePad() {
    const mechanicSignatureCanvas: HTMLCanvasElement | null = this.mechanicSignaturePadElement.nativeElement;

    if (mechanicSignatureCanvas) {
      this.mechanicSignaturePad = new SignaturePad(mechanicSignatureCanvas, this.signaturePadOptions);
      mechanicSignatureCanvas.addEventListener('touchend', () => {
        this.updateMechanicSignatureField();
      });

      // if (this.dvir && this.dvir.mechanicSignatureBase64) {
      //   this.renderMechanicSignature('data:image/png;base64,' + this.dvir.mechanicSignatureBase64);
      // }
    }
    if (this.dvir.mechanicSignatureLink && this.dvir.mechanicSignatureLink.length !== 0) {
      this.mechanicSignatureFound = true;
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
      image.src = signatureData;
    }
  }

  renderMechanicSignature(mechanicSignatureData: string) {
    const canvas: HTMLCanvasElement | null = this.mechanicSignaturePadElement.nativeElement;
    if (canvas) {
      const context = canvas.getContext('2d');
      const image = new Image();
      image.onload = () => {
        context?.drawImage(image, 0, 0);
      };
      image.src = mechanicSignatureData;
    }
  }

  clearSignature() {
    this.signatureRestored = false;
    if (this.signatureFound) {
      this.signatureFound = false;
      this.dvir.signatureLink = '';
    }
    if (this.signaturePad) {
      this.signaturePad.clear();
      this.dvir.signatureBase64 = '';
    }
  }

  async restoreSignature() {
    if (this.signatureFound) {
      this.toastService.showToast(this.translate.instant('Signatured already restored!'), 'warning');
      return;
    }
    this.imageLoading = true;
    const firstNonEmptySignature = this.dvirs.find(
      dvir => dvir.signatureId !== '' && dvir.signatureId !== '00000000-0000-0000-0000-000000000000' && dvir.signatureLink !== '' && dvir.dvirId !== this.dvir.dvirId
    );

    if (firstNonEmptySignature) {
      this.dvir.signatureBase64 = '';
      this.dvir.signatureLink = firstNonEmptySignature.signatureLink;
      this.dvir.signatureId = firstNonEmptySignature.signatureId;
      this.signatureFound = true;
      this.signatureRestored = true;
      this.signatureTimeout();
    } else if (this.oldSignatureId.length !== 0 && this.oldSignatureLink.length !== 0) {
      this.dvir.signatureId = this.oldSignatureId;
      this.dvir.signatureLink = this.oldSignatureLink;
      this.signatureFound = true;
      this.signatureRestored = true;
      this.signatureTimeout();
      this.toastService.showToast(this.translate.instant('No other signature found. Restoring old signature.'), 'warning');
    } else {
      this.signatureFound = false;
      this.toastService.showToast(this.translate.instant('No signature found on this current dvir.'));
    }
  }

  clearMechanicSignature() {
    this.mechanicSignatureRestored = false;
    this.mechanicSignatureFound = false;
    if (this.mechanicSignaturePad) {
      this.mechanicSignaturePad.clear();
      this.dvir.mechanicSignatureBase64 = '';
    }
  }

  restoreMechanicSignature() {
    if (this.mechanicSignatureFound) {
      this.toastService.showToast(this.translate.instant('Signature already present!'), 'warning');
      return;
    }

    this.mechanicImageLoading = true;
    if (this.dvir.mechanicSignatureLink && this.dvir.mechanicSignatureLink.length !== 0) {
      this.mechanicSignatureFound = true;
      this.mechanicSignatureRestored = true;
      this.mechanicSignatureTimeout();
    } else {
      this.mechanicSignatureFound = false;
      this.toastService.showToast(this.translate.instant('No mechanic signature found!'));
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

  updateMechanicSignatureField() {
    if (this.mechanicSignaturePad && !this.mechanicSignaturePad.isEmpty()) {
      const mechanicSignatureDataURL = this.mechanicSignaturePad.toDataURL().slice(22);
      this.dvir.mechanicSignatureBase64 = mechanicSignatureDataURL;
      this.dvir.repairDate = this.today.getTime();
      this.dvir.repairTimeZone = this.timeZone;
    } else {
      this.dvir.mechanicSignatureBase64 = '';
    }
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

  getRepairDate() {
    return this.dvir?.repairDate ? this.dvir?.repairDate : this.today.getTime();
  }

  goBack() {
    this.interService.changeMessage({ topic: 'dvir' });
    this.navCtrl.navigateBack('/unitab/dvir');
    this.shareService.destroyMessage();
  }

  getHour(value: number) {
    return (
      this.translate.instant(formatDate(value, 'LLL', 'en_US', this.timeZones[this.timeZone])) +
      ' ' +
      formatDate(value, 'd', 'en_US', this.timeZones[this.timeZone]) +
      this.getOrdinalSuffix(formatDate(value, 'd', 'en_US', this.timeZones[this.timeZone])) +
      ', ' +
      formatDate(value, 'yyyy', 'en_US', this.timeZones[this.timeZone])
    );
  }

  getOrdinalSuffix(sday: string): string {
    let day = parseInt(sday);
    if (day >= 11 && day <= 13) {
      return this.translate.instant('th');
    }

    switch (day % 10) {
      case 1:
        return this.translate.instant('st');
      case 2:
        return this.translate.instant('nd');
      case 3:
        return this.translate.instant('rd');
      default:
        return this.translate.instant('th');
    }
  }

  getTime(value: number) {
    return formatDate(value, 'hh:mm a', 'en_US', this.timeZones[this.timeZone]);
  }

  resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.signaturePadElement.nativeElement.width = this.signaturePadElement.nativeElement.offsetWidth * ratio;
    this.signaturePadElement.nativeElement.height = this.signaturePadElement.nativeElement.offsetHeight * ratio;
    this.signaturePadElement.nativeElement.getContext('2d').scale(ratio, ratio);
    this.clearSignature();
  }

  resizeMechCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.mechanicSignaturePadElement.nativeElement.width = this.mechanicSignaturePadElement.nativeElement.offsetWidth * ratio;
    this.mechanicSignaturePadElement.nativeElement.height = this.mechanicSignaturePadElement.nativeElement.offsetHeight * ratio;
    this.mechanicSignaturePadElement.nativeElement.getContext('2d').scale(ratio, ratio);
    this.clearMechanicSignature();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeCanvas();
    this.resizeMechCanvas();
  }
}
