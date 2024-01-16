import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-log-certify',
  templateUrl: './log-certify.page.html',
  styleUrls: ['./log-certify.page.scss'],
})
export class LogCertifyPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sPad', { static: false }) signaturePad!: ElementRef;

  signaturePadEl: SignaturePad;

  backUrl: string;
  logDate: string;

  signature: string = '';

  routeSubscription: Subscription;

  isConfirmButtonActive: boolean = false;
  checkbox: boolean = false;

  signaturePadOptions: any = {
    minWidth: 2,
    maxWidth: 3,
    backgroundColor: '#FFFFFF',
    penColor: 'black',
  };

  constructor(private navCtrl: NavController, private route: ActivatedRoute) {}

  ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.backUrl = params['url'];
      this.logDate = params['date'];
    });
  }

  ngAfterViewInit(): void {
    this.initSignaturePad();
  }

  ngOnDestroy(): void {}

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

      // if (this.dvir && this.dvir.Signature) {
      //   this.renderSignature('data:image/png;base64,' + this.dvir.Signature);
      // }
    }
  }

  // restoreSignature() {
  //   const firstNonEmptySignature = this.logDailies.find(log => log.form.signatureId !== '');

  //   if (firstNonEmptySignature) {
  //     this.renderSignature(firstNonEmptySignature.form.signatureId);
  //   }
  // }

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
    console.log('bskfbskdfbkj');
  }

  onSelectCheckbox(data: any) {
    this.checkbox = data.detail.checked;
    this.activateSave();
  }

  activateSave() {
    if (this.signature.length !== 0 && this.checkbox) this.isConfirmButtonActive = true;
    else this.isConfirmButtonActive = false;
  }
}
