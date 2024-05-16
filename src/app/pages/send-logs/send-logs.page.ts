import { Component, OnDestroy, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { ShareService } from 'src/app/services/share.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-send-logs',
  templateUrl: './send-logs.page.html',
  styleUrls: ['./send-logs.page.scss'],
})
export class SendLogsPage implements OnInit, OnDestroy {
  dataTransferType: string = '';
  comments: string = '';

  loading: boolean = false;

  validation = {
    dataTransferType: false,
    comments: false,
  };

  options: string[] = ['Email', 'Web'];

  constructor(private navCtrl: NavController, private shareService: ShareService, private utilityService: UtilityService) {}

  ngOnInit() {
    this.shareService.changeMessage('reset');
  }

  ngOnDestroy(): void {
    this.shareService.destroyMessage();
  }

  ionWillLeave() {
    this.shareService.destroyMessage();
  }

  submit() {
    this.shareService.changeMessage(this.utilityService.generateString(5));
    if (!this.utilityService.validateForm(this.validation)) return;

    this.loading = true;
    // Waiting for the back end function to send logs to hos

    this.loading = false;
    this.goBack();
  }

  showSelection() {}

  goBack() {
    this.navCtrl.navigateBack('unitab/inspection');
  }
  
  getPlatform() {
    return Capacitor.getPlatform();
  }
}
