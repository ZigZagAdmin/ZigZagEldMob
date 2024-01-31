import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.page.html',
  styleUrls: ['./instructions.page.scss'],
})
export class InstructionsPage implements OnInit {
  pdfError: boolean = false;

  constructor(private navCtrl: NavController, private toastService: ToastService) {}

  ngOnInit() {}

  pdfNotLoading() {
    this.pdfError = true;
    this.toastService.showToast('Manual PDF could not be loaded!');
  }

  goBack() {
    this.navCtrl.navigateBack('/information');
  }
}
