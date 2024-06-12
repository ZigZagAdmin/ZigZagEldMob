import { Component, OnDestroy, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { ManageService } from 'src/app/services/manage.service';
import { ShareService } from 'src/app/services/share.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Storage } from '@ionic/storage';
import { firstValueFrom } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-send-logs',
  templateUrl: './send-logs.page.html',
  styleUrls: ['./send-logs.page.scss'],
})
export class SendLogsPage implements OnInit, OnDestroy {
  dataTransferType: string = ''; // email | web
  comments: string = '';
  driverId: string;

  loading: boolean = false;

  validation = {
    dataTransferType: false,
    comments: false,
  };

  options: string[] = ['Email', 'Web'];

  constructor(
    private navCtrl: NavController,
    private shareService: ShareService,
    private utilityService: UtilityService,
    private manageService: ManageService,
    private storage: Storage,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    this.shareService.changeMessage('reset');
    this.driverId = await this.storage.get('driverId');
  }

  ngOnDestroy(): void {
    this.shareService.destroyMessage();
  }

  ionWillLeave() {
    this.shareService.destroyMessage();
  }

  async submit() {
    this.shareService.changeMessage(this.utilityService.generateString(5));
    if (!this.utilityService.validateForm(this.validation)) return;

    this.loading = true;
    try {
      let result = await firstValueFrom(this.manageService.generateEldData(this.driverId, this.comments, this.dataTransferType.toLocaleLowerCase()));
      console.log(result);
      this.toastService.showToast('Log File sent successfully!', 'success');
      this.loading = false;
      this.goBack();
    } catch (e) {
      console.log((e as HttpErrorResponse));
      if((e as HttpErrorResponse).status === 200) {
        this.toastService.showToast('Log File sent successfully!', 'success');
        this.loading = false;
        this.goBack();
        return;
      } 
      this.toastService.showToast('There was an error sending the Log Files!', 'danger');
      this.loading = false;
    }
  }

  showSelection() {}

  goBack() {
    this.navCtrl.navigateBack('unitab/inspection');
  }

  getPlatform() {
    return Capacitor.getPlatform();
  }
}
