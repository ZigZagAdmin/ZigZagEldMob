import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-edit-dvir',
  templateUrl: './edit-dvir.page.html',
  styleUrls: ['./edit-dvir.page.scss'],
})
export class EditDvirPage implements OnInit, OnDestroy {
  @ViewChild('sPad', { static: false }) signaturePadElement!: ElementRef;
  @ViewChild('mechanicSPad', { static: false }) mechanicSignaturePadElement!: ElementRef;

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
  networkStatus = false;
  networkSub: Subscription;

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
  imageLoading: boolean = false;

  today = new Date();
  timeZone: string = '';

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
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.pageLoading = true;
    this.imageLoading = true;

    let dvirId$ = firstValueFrom(this.activatedRoute.queryParams);
    let company$ = firstValueFrom(this.databaseService.getCompany());
    let dvirs$ = firstValueFrom(this.databaseService.getDvirs());
    let timeZone$ = this.storage.get('TimeZoneCity');

    forkJoin([company$, dvirs$, dvirId$, timeZone$]).subscribe(
      ([company, dvirs, params, timeZone]) => {
        this.dvirId = params['dvirId'];
        this.company = company;
        this.dvirs = dvirs;
        this.timeZone = timeZone;
        this.dvir = this.dvirs.find(item => item.dvirId === this.dvirId);
        this.dvir.signatureBase64 = '';
        this.dvir.mechanicSignatureBase64 = '';
        this.dvir.mechanicSignatureLink = '';
        console.log(this.dvir);
        this.locationDisable = !!this.dvir.location.description;
        this.vehicleUnitDisable = !!this.dvir.vehicle.vehicleUnit;
        this.pageLoading = false;
      },
      error => console.log(error)
    );

    this.networkSub = this.internetService.internetStatus$.subscribe(data => (this.networkStatus = data));
  }

  ionViewDidEnter(): void {
    this.initSignaturePad();
    this.initMechanicalSignaturePad();
  }

  ngOnDestroy(): void {
    this.networkSub.unsubscribe();
  }

  switchStatus(status: string) {
    if (status.length !== 0 && status !== this.lastStatus) {
      console.log(status);
      this.lastStatus = status;
      this.dvir.status.code = status;
      this.dvir.status.name = dvirStatuses.find(el => el.code === status).name;
    }
    this.dvir.mechanicSignatureId = '00000000-0000-0000-0000-000000000000';
    this.dvir.mechanicSignatureBase64 = '';
    this.clearMechanicSignature();
  }

  imageLoaded() {
    this.imageLoading = false;
  }

  checkSelectPresent(data: any) {
    if (this.dvir.defectsTrailers === '' && this.dvir.defectsVehicle === '') {
      this.switchStatus('VCS');
    } else {
      this.switchStatus('D');
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
      this.toastService.showToast('You cannot select "Has Defects" without selecting any defect!');
      return;
    }
    if (this.dvir.signatureBase64.length === 0 && this.dvir.signatureLink.length === 0) {
      this.toastService.showToast('Please sign the form before saving!');
      return;
    }
    if (this.dvir.status.code === 'DC') this.dvir.mechanicSignatureId = this.utilityService.uuidv4();
    if (this.dvir.status.code === 'DC' && this.dvir.mechanicSignatureBase64.length === 0 && this.dvir.mechanicSignatureLink.length === 0) {
      this.toastService.showToast('Please complete the mechanic signature!');
      return;
    }
    console.log(this.dvir);
    if (this.networkStatus === true) {
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

      if (this.dvir && this.dvir.signatureBase64) {
        this.renderSignature('data:image/png;base64,' + this.dvir.signatureBase64);
      }
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

      if (this.dvir && this.dvir.mechanicSignatureBase64) {
        this.renderMechanicSignature('data:image/png;base64,' + this.dvir.mechanicSignatureBase64);
      }
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
    const firstNonEmptySignature = this.dvirs.find(dvir => dvir.signatureId !== '' && dvir.signatureId !== '00000000-0000-0000-0000-000000000000' && dvir.signatureLink !== '');

    if (firstNonEmptySignature) {
      this.dvir.signatureBase64 = '';
      this.dvir.signatureLink = firstNonEmptySignature.signatureLink;
      this.dvir.signatureId = firstNonEmptySignature.signatureId;
      console.log(firstNonEmptySignature);
      this.signatureFound = true;
    } else {
      this.signatureFound = false;
      this.toastService.showToast('No signature found on this current dvir.');
    }
  }

  clearMechanicSignature() {
    if (this.mechanicSignaturePad) {
      this.mechanicSignaturePad.clear();
      this.dvir.mechanicSignatureBase64 = '';
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
      const mechanicSignatureDataURL = this.mechanicSignaturePad.toDataURL();
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
