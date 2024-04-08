import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-user-manual',
  templateUrl: './user-manual.page.html',
  styleUrls: ['./user-manual.page.scss'],
})
export class UserManualPage implements OnInit {
  pdfError: boolean = false;

  constructor(private navCtrl: NavController, private toastService: ToastService, private translate: TranslateService) {}

  ngOnInit() {}

  pdfNotLoading() {
    this.pdfError = true;
    this.toastService.showToast(this.translate.instant('Manual PDF could not be loaded!'));
  }

  goBack() {
    this.navCtrl.navigateBack('/information');
  }
}
