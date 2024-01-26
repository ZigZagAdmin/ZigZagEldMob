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
  optionDisable: boolean = false;

  loading: boolean = false;

  pageLoading: boolean = false;

  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private dashboardService: DashboardService,
    private databaseService: DatabaseService,
    private internetService: InternetService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private shareService: ShareService
  ) {}

  ngOnInit() {
    this.pageLoading = true;

    let dvirId$ = firstValueFrom(this.activatedRoute.queryParams);
    let company$ = firstValueFrom(this.databaseService.getCompany());
    let dvirs$ = firstValueFrom(this.databaseService.getDvirs());

    forkJoin([company$, dvirs$, dvirId$]).subscribe(
      ([company, dvirs, params]) => {
        this.dvirId = params['dvirId'];
        this.company = company;
        this.dvirs = dvirs;
        this.dvir = Object.create(this.dvirs.find(item => item.dvirId === this.dvirId));
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
  }

  checkSelectPresent(data: any) {
    if (data && data.length !== 0) {
      console.log(data);
      if (data === 'No Defects') {
        this.optionDisable = false;
        this.switchStatus('VCS');
      } else {
        this.optionDisable = true;
        this.switchStatus('D');
      }
    }
  }

  navigateBack() {
    this.router.navigate(['/unitab/dvir']);
  }

  async onSubmit() {
    if (this.networkStatus === true) {
      this.dashboardService.updateDVIR(this.dvir).subscribe(
        async response => {
          console.log('DVIRs got updated on the server: ', response);
          await this.updateDvirs(this.dvir, true);
        },
        async error => {
          this.updateDvirs(this.dvir, false);
          console.warn('Server Error: ', error);
          await console.warn('Pushed dvirs in offline mode');
        }
      );
    } else {
      await this.updateDvirs(this.dvir, false);
      console.warn('Pushed dvirs in offline mode');
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
    if (this.signaturePad) {
      this.signaturePad.clear();
      // this.form.patchValue({ Signature: '' });
    }
  }

  clearMechanicSignature() {
    if (this.mechanicSignaturePad) {
      this.mechanicSignaturePad.clear();
      // this.form.patchValue({ MechanicSignature: '' });
    }
  }

  updateSignatureField() {
    if (this.signaturePad && !this.signaturePad.isEmpty()) {
      const signatureDataURL = this.signaturePad.toDataURL();
      // this.form.patchValue({ Signature: signatureDataURL });
    } else {
      // this.form.patchValue({ Signature: '' });
    }
  }

  updateMechanicSignatureField() {
    if (this.mechanicSignaturePad && !this.mechanicSignaturePad.isEmpty()) {
      const mechanicSignatureDataURL = this.mechanicSignaturePad.toDataURL();
      // this.form.patchValue({ MechanicSignature: mechanicSignatureDataURL });
    } else {
      // this.form.patchValue({ MechanicSignature: '' });
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
