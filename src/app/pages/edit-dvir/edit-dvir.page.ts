import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

import { DatabaseService } from 'src/app/services/database.service';
import { InternetService } from 'src/app/services/internet.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Company } from 'src/app/models/company';
import { DVIRs } from 'src/app/models/dvirs';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-edit-dvir',
  templateUrl: './edit-dvir.page.html',
  styleUrls: ['./edit-dvir.page.scss'],
})
export class EditDvirPage implements OnInit, AfterViewChecked {
  @ViewChild('sPad', { static: false }) signaturePadElement!: ElementRef;
  @ViewChild('mechanicSPad', { static: false }) mechanicSignaturePadElement!: ElementRef;

  defectsVehicle = [
    'Air Compressor',
    'Battery',
    'Body',
    'Brake Accessories',
    'Coupling Devices',
    'Drive Line',
    'Exhaust',
    'Fluid Levels',
    'Front Axle',
    'Headlights',
    'Horn',
    'Muffler',
    'Parking Breaks',
    'Reflectors',
    'Service Breaks',
    'Starter',
    'Suspension System',
    'Tire Chains',
    'Transmission',
    'Turn Indicators',
    'Windows',
    'Wipers & Washers',
    'Air Lines',
    'Belts & Hoses',
    'Clutch',
    'Defroster',
    'Engine',
    'Fifth Wheel',
    'Frame & Assembly',
    'Fuel Tanks',
    'Heater',
    'Mirrors',
    'Oil Level',
    'Radiator Level',
    'Safety Equipment',
    'Service Door',
    'Steering',
    'Tail Lights',
    'Tires',
    'Trip Recorder',
    'Wheels & Rims',
    'Windshield',
  ];
  defectsTrailers = [
    'Brake Connections',
    'Coupling Devices',
    'Doors',
    'Landing Gear',
    'Other',
    'Roof',
    'Suspension System',
    'Wheels & Rims',
    'Breaks',
    'Coupling Pin',
    'Hitch',
    'Lights',
    'Reflectors',
    'Straps',
    'Tarpaulin',
  ];
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
  mechanicSignaturePad!: SignaturePad | null
  company: Company | undefined;
  dvirs: DVIRs[] = [];
  dvir: any;
  bReady: boolean = false;
  pickedVehicle: string = '';
  vehicleId: string = '';
  driverId: string = '';
  dvirId!: string | null;
  form!: FormGroup;
  networkStatus = false;
  networkSub!: Subscription;
  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private databaseService: DatabaseService,
    private dashboardService: DashboardService,
    private internetService: InternetService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      Date: [''],
      Time: [''],
      LocationDescription: ['3mi from Chisinau, Chisinau'],
      VehicleUnit: [''],
      Trailers: [''],
      Odometer: ['0'],
      DefectsVehicle: [''],
      DefectsTrailers: [''],
      Remarks: [''],
      StatusName: ['', Validators.required],
      StatusCode: ['', Validators.required],
      Comments: [''],
      Signature: ['', Validators.required],
      MechanicSignature: [''],
    });
  }

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.dvirId = params.get('dvirId');
    });
    this.databaseSubscription =
      this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
        if (ready) {
          this.bReady = ready;
          this.databaseService.getCompany().subscribe((company) => {
            this.company = company;
          });
          this.databaseService.getDvirs().subscribe((dvirs) => {
            this.dvirs = dvirs;
            this.dvir = this.dvirs.find((item) => item.DVIRId === this.dvirId);
            if (this.dvir) {
              this.initSignaturePad();
              this.fillFormWithDvirData();
            }
          });
        }
      });
    this.pickedVehicle = await this.storage.get('pickedVehicle');
    this.vehicleId = await this.storage.get('vehicleId');
    this.driverId = await this.storage.get('driverId');

    this.form
      .get('DefectsTrailers')
      ?.valueChanges.subscribe((selectedDefects) => {
        const trailersControl = this.form.get('Trailers');
        if (selectedDefects && selectedDefects.length > 0) {
          trailersControl?.setValidators(Validators.required);
        } else {
          trailersControl?.clearValidators();
        }
        trailersControl?.updateValueAndValidity();
      });

    this.networkSub = this.internetService.internetStatus$.subscribe(
      (status) => {
        this.networkStatus = status;
        console.log('Intenet Status' + status);
      }
    );
  }

  switchStatus(status: string) {
    if (status !== 'DC') {
      this.mechanicSignaturePad = null
    }
    this.form.value.StatusCode = status
  }

  navigateBack() {
    this.router.navigate(['/unitab/dvir'])
  }

  ngAfterViewChecked() {
    if (
      this.form.value.StatusCode === 'DC' &&
      this.mechanicSignaturePadElement &&
      this.mechanicSignaturePadElement.nativeElement &&
      !this.mechanicSignaturePad
    ) {
      this.initMechanicalSignaturePad();
    }
  }

  fillFormWithDvirData() {
    if (this.dvir) {
      const defectsVehicleArray = this.dvir.DefectsVehicle.split(',').map(
        (element: string) => element.trim()
      );
      const defectsTrailersArray = this.dvir.DefectsTrailers.split(',').map(
        (element: string) => element.trim()
      );

      this.form.patchValue({
        Date: formatDate(this.dvir.CreateDate, 'MMM d, y', 'en_US'),
        Time: formatDate(this.dvir.CreateDate, 'h:mm a', 'en_US'),
        LocationDescription: this.dvir.LocationDescription,
        VehicleUnit: this.dvir.VehicleUnit,
        Trailers: this.dvir.Trailers,
        Odometer: this.dvir.Odometer,
        DefectsVehicle: defectsVehicleArray,
        DefectsTrailers: defectsTrailersArray,
        Remarks: this.dvir.Remarks,
        StatusName: this.dvir.StatusName,
        StatusCode: this.dvir.StatusCode,
        Signature: 'data:image/png;base64,' + this.dvir.Signature,
        MechanicSignature:
          'data:image/png;base64,' + this.dvir.MechanicSignature || '',
      });
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      const selectedStatusCode = this.form.value.StatusCode;
      const selectedStatus = this.DvirStatuses.find(
        (status) => status.StatusCode === selectedStatusCode
      );
      const selectedStatusName = selectedStatus?.StatusName || '';

      const defectsVehicle = Array.isArray(this.form.value.DefectsVehicle)
        ? this.form.value.DefectsVehicle.join(', ')
        : this.form.value.DefectsVehicle || '';

      const defectsTrailers = Array.isArray(this.form.value.DefectsTrailers)
        ? this.form.value.DefectsTrailers.join(', ')
        : this.form.value.DefectsTrailers || '';

      if (this.form.value.StatusCode !== 'DC') {
        this.form.patchValue({ MechanicSignature: '' });
      }

      const dvirData: DVIRs = {
        DVIRId: this.dvir.DVIRId,
        CreateDate: this.dvir.CreateDate,
        VehicleUnit: this.pickedVehicle,
        VehicleId: this.vehicleId,
        DriverId: this.driverId,
        Trailers: this.form.value.Trailers,
        Odometer: this.form.value.Odometer,
        DefectsVehicle: defectsVehicle,
        DefectsTrailers: defectsTrailers,
        Remarks: this.form.value.Remarks || '',
        StatusCode: selectedStatusCode,
        StatusName: selectedStatusName,
        Latitude: '0',
        Longitude: '0',
        LocationDescription: this.form.value.LocationDescription,
        Signature: this.form.value.Signature.slice(22),
        MechanicSignature: this.form.value.MechanicSignature.slice(22) || '',
        RepairDate: '',
      };

      console.log(dvirData);

      if (this.networkStatus === true) {
        this.dashboardService.updateDVIR(dvirData).subscribe(
          (response) => {
            console.log('DVIR is updated on server:', response);
          },
          async (error) => {
            console.log('Internet Status' + this.networkStatus);
            let tempEerror = {
              url: 'api/EldDashboard/uploadDVIR',
              body: dvirData,
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
          body: dvirData,
        };
        let offlineArray = await this.storage.get('offlineArray');
        offlineArray.push(tempEerror);
        await this.storage.set('offlineArray', offlineArray);
        console.log('Pushed in offlineArray');
      }

      const index = this.dvirs.findIndex((item) => item.DVIRId === this.dvirId);
      if (index !== -1) {
        this.dvirs[index] = dvirData;
      }
      await this.storage.set('dvirs', this.dvirs);
      this.navCtrl.navigateBack('/unitab/dvir');
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

      if (this.dvir && this.dvir.Signature) {
        this.renderSignature('data:image/png;base64,' + this.dvir.Signature);
      }
    }
  }

  initMechanicalSignaturePad() {
    console.log('vizvali');
    const mechanicSignatureCanvas: HTMLCanvasElement | null =
      this.mechanicSignaturePadElement.nativeElement;

    if (mechanicSignatureCanvas) {
      this.mechanicSignaturePad = new SignaturePad(
        mechanicSignatureCanvas,
        this.signaturePadOptions
      );
      mechanicSignatureCanvas.addEventListener('touchend', () => {
        this.updateMechanicSignatureField();
      });

      if (this.dvir && this.dvir.MechanicSignature) {
        this.renderMechanicSignature(
          'data:image/png;base64,' + this.dvir.MechanicSignature
        );
      }
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
      image.src = signatureData;
    }
  }

  renderMechanicSignature(mechanicSignatureData: string) {
    const canvas: HTMLCanvasElement | null =
      this.mechanicSignaturePadElement.nativeElement;
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
      this.form.patchValue({ Signature: '' });
    }
  }

  clearMechanicSignature() {
    if (this.mechanicSignaturePad) {
      this.mechanicSignaturePad.clear();
      this.form.patchValue({ MechanicSignature: '' });
    }
  }

  updateSignatureField() {
    if (this.signaturePad && !this.signaturePad.isEmpty()) {
      const signatureDataURL = this.signaturePad.toDataURL();
      this.form.patchValue({ Signature: signatureDataURL });
    } else {
      this.form.patchValue({ Signature: '' });
    }
  }

  updateMechanicSignatureField() {
    if (this.mechanicSignaturePad && !this.mechanicSignaturePad.isEmpty()) {
      const mechanicSignatureDataURL = this.mechanicSignaturePad.toDataURL();
      this.form.patchValue({ MechanicSignature: mechanicSignatureDataURL });
    } else {
      this.form.patchValue({ MechanicSignature: '' });
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

  ionViewWillEnter() {
    if (this.bReady) {
      this.databaseSubscription = this.databaseService
        .getDvirs()
        .subscribe((dvirs) => {
          this.dvirs = dvirs;
          console.log(this.dvirs);
        });
    }
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
    this.networkSub.unsubscribe();
  }
}
