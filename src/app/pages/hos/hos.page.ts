import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { LogDailies } from 'src/app/models/log-dailies';

@Component({
  selector: 'app-hos',
  templateUrl: './hos.page.html',
  styleUrls: ['./hos.page.scss'],
})
export class HosPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  message = '';
  name!: string;
  someErrors: boolean = false;
  bReady: boolean = false;
  databaseSubscription: Subscription | undefined;
  logDailies: LogDailies[] = [];
  selectedButton: String = '';

  constructor(
    private navCtrl: NavController,
    private databaseService: DatabaseService
  ) {}

  ngOnInit() {
    console.log('init dvirs');
    this.databaseSubscription =
      this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
        if (ready) {
          this.bReady = ready;
          this.databaseSubscription = this.databaseService
            .getLogDailies()
            .subscribe((logDailies) => {
              this.logDailies = logDailies;
              console.log(this.logDailies);
            });
        }
      });
  }

  ionViewWillEnter() {
    console.log('willEnter hos');
    if (this.bReady) {
      this.databaseSubscription = this.databaseService
        .getLogDailies()
        .subscribe((logDailies) => {
          this.logDailies = logDailies;
          console.log(this.logDailies);
        });
    }
  }

  selectButton(button: string) {
    this.selectedButton = button;
    console.log(this.selectedButton);
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.selectedButton) {
      this.modal.dismiss(this.selectedButton, 'confirm');
    }
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `${ev.detail.data}`;
      // Обновите кнопку Current Status
    }
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
  }
}
