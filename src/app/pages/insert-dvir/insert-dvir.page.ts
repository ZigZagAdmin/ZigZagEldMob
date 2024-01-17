import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';
import SignaturePad from 'signature_pad';

import { DatabaseService } from 'src/app/services/database.service';
import { Company } from 'src/app/models/company';
import { DVIRs } from 'src/app/models/dvirs';
import { DashboardService } from 'src/app/services/dashboard.service';
import { InternetService } from 'src/app/services/internet.service';

@Component({
  selector: 'app-insert-dvir',
  templateUrl: './insert-dvir.page.html',
  styleUrls: ['./insert-dvir.page.scss'],
})
export class InsertDvirPage implements OnInit {
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
  DvirStatuses1 = [
    { StatusCode: 'VCS', StatusName: 'Vehicle Condition Satisfactory' },
    { StatusCode: 'D', StatusName: 'Has Defects' },
    { StatusCode: 'DC', StatusName: 'Defects Corrected' },
    {
      StatusCode: 'DNNBC',
      StatusName: 'Defects Need Not Be Corrected',
    },
  ];
  DvirStatuses = [
    { StatusCode: 'VCS', StatusName: 'Vehicle Condition Satisfactory' },
    { StatusCode: 'D', StatusName: 'Has Defects' },
  ];
  signaturePadOptions: any = {
    minWidth: 2,
    maxWidth: 3,
    backgroundColor: '#FFFFFF',
    penColor: 'black',
  };
  DvirId: string = '';
  signaturePad!: SignaturePad;
  form!: FormGroup;
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

  constructor(
    private databaseService: DatabaseService,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private dashboardService: DashboardService,
    private internetService: InternetService,
    private navCtrl: NavController
  ) {
    this.form = this.formBuilder.group({
      Date: [new Date().toISOString().slice(0, 19)],
      Time: [new Date().toISOString().slice(0, 19)],
      LocationDescription: ['3mi from Chisinau, Chisinau'],
      VehicleUnit: [''],
      Trailers: [''],
      Odometer: ['0'],
      DefectsVehicle: [''],
      DefectsTrailers: [''],
      Remarks: [''],
      StatusName: ['Vehicle Condition Satisfactory', Validators.required],
      StatusCode: ['VCS', Validators.required],
      Comments: [''],
      Signature: ['', Validators.required],
    });
  }

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

    this.form.get('DefectsVehicle')?.valueChanges.subscribe(defectsVehicle => {
      const defectsTrailers = this.form.value.DefectsTrailers || [];
      this.updateDvirStatusCode(defectsVehicle, defectsTrailers);
    });

    this.form.get('DefectsTrailers')?.valueChanges.subscribe(defectsTrailers => {
      const defectsVehicle = this.form.value.DefectsVehicle || [];
      this.updateDvirStatusCode(defectsVehicle, defectsTrailers);
    });

    this.form.get('DefectsTrailers')?.valueChanges.subscribe(selectedDefects => {
      const trailersControl = this.form.get('Trailers');
      if (selectedDefects && selectedDefects.length > 0) {
        trailersControl?.setValidators(Validators.required);
      } else {
        trailersControl?.clearValidators();
      }
      trailersControl?.updateValueAndValidity();
    });

    this.networkSub = this.internetService.internetStatus$.subscribe(status => {
      this.networkStatus = status;
      console.log('Intenet Status' + status);
    });
  }

  switchStatus(status: string) {
    this.form.value.StatusCode = status;
  }

  updateDvirStatusCode(defectsVehicle: any[], defectsTrailers: any[]) {
    const hasDefects = defectsVehicle.length > 0 || defectsTrailers.length > 0;
    this.form.patchValue({ StatusCode: hasDefects ? 'D' : 'VCS' });
  }

  isStatusDisabled(statusToDisable: string): boolean {
    const defectsVehicle = this.form.value.DefectsVehicle || [];
    const defectsTrailers = this.form.value.DefectsTrailers || [];
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
      this.form.patchValue({ Signature: signatureDataURL });
    } else {
      this.form.patchValue({ Signature: '' });
    }
  }

  clearSignature() {
    if (this.signaturePad) {
      this.signaturePad.clear();
      this.form.patchValue({ Signature: '' });
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      const selectedStatusCode = this.form.value.StatusCode;
      const selectedStatus = this.DvirStatuses.find(status => status.StatusCode === selectedStatusCode);
      const selectedStatusName = selectedStatus?.StatusName || '';

      const defectsVehicle = Array.isArray(this.form.value.DefectsVehicle) ? this.form.value.DefectsVehicle.join(', ') : this.form.value.DefectsVehicle || '';

      const defectsTrailers = Array.isArray(this.form.value.DefectsTrailers) ? this.form.value.DefectsTrailers.join(', ') : this.form.value.DefectsTrailers || '';

      const dvirData: DVIRs = {
        dvirId: this.uuidv4(),
        driver: {
          driverId: this.driverId,
        },
        vehicle: {
          vehicleUnit: this.vehicleUnit,
          vehicleId: this.vehicleId,
        },
        odometer: this.form.value.Odometer,
        trailers: this.form.value.Trailers,
        defectsVehicle: defectsVehicle,
        defectsTrailers: defectsTrailers,
        remarks: this.form.value.Remarks || '',
        status: { code: selectedStatusCode, name: selectedStatusName },
        location: {
          description: this.form.value.LocationDescription,
          latitude: 0,
          longitude: 0,
        },
        createDate: new Date(formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en-US')).getTime(),
        createTimeZone: '',
        repairDate: 0,
        repairTimeZone: '',

        signatureId: this.uuidv4(),
        signatureBase64: this.form.value.Signature,
      };

      if (this.networkStatus === true) {
        console.log('here uploading');
        this.dashboardService.updateDVIR(dvirData).subscribe(
          response => {
            console.log('DVIR is on server:', response);
          },
          async error => {
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

      this.dvirs.unshift(dvirData);
      await this.storage.set('dvirs', this.dvirs);
      this.navCtrl.navigateBack('/unitab/dvir');
    }
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
  }
}
