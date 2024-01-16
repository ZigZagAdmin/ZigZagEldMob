import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EventGraphic } from 'src/app/models/event-graphic';

@Component({
  selector: 'app-edit-duty-status',
  templateUrl: './edit-duty-status.page.html',
  styleUrls: ['./edit-duty-status.page.scss'],
})
export class EditDutyStatusPage implements OnInit, OnDestroy {
  backUrl: string;

  urlSubscription: Subscription;
  selectedButton: string = '';
  currentStatus: string = '';
  location: string;
  comments: string;

  isConfirmButtonActive: boolean = false;

  graphicsHour = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  eventGraphicLine: EventGraphic[] = [];

  constructor(private nacCtrl: NavController, private route: ActivatedRoute) {}

  ngOnInit() {
    this.urlSubscription = this.route.queryParams.subscribe(params => {
      this.backUrl = params['url'];
      this.currentStatus = params['currentStatus'];
    });
  }

  ngOnDestroy(): void {}

  goBack() {
    this.nacCtrl.navigateBack(this.backUrl);
  }

  save() {}

  selectButton(button: string) {
    this.selectedButton = button;
    if (this.selectedButton === this.currentStatus) {
      this.isConfirmButtonActive = false;
    } else {
      this.isConfirmButtonActive = true;
    }
  }
}
