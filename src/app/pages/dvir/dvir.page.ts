import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DVIRs } from 'src/app/models/dvirs';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { InterService } from 'src/app/services/inter.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dvir',
  templateUrl: './dvir.page.html',
  styleUrls: ['./dvir.page.scss'],
})
export class DvirPage implements OnInit, OnDestroy {
  bLoading: boolean = true;
  bReady: boolean = false;
  dvirs: DVIRs[] = [];
  interSub: Subscription;
  pickedVehicle: String = '';

  pageLoading: boolean = false;

  constructor(private navCtrl: NavController, private databaseService: DatabaseService, private interSerivce: InterService, private translate: TranslateService) {}

  ngOnInit() {
    this.interSub = this.interSerivce.currentMessage.subscribe(async message => {
      if (message && message.topic === 'dvir') {
        this.pageLoading = true;
        await firstValueFrom(this.databaseService.getDvirs()).then(dvirs => {
          this.dvirs = dvirs;
          this.pageLoading = false;
        });
      }
    });
  }

  async ionViewWillEnter() {
    this.pageLoading = true;
    await firstValueFrom(this.databaseService.getDvirs()).then(dvirs => {
      this.dvirs = dvirs;
      this.pageLoading = false;
    });
  }

  editDvir(dvir: DVIRs) {
    this.navCtrl.navigateForward('/edit-dvir', { queryParams: { dvirId: dvir.dvirId } });
  }

  insertDvir() {
    this.navCtrl.navigateForward('/insert-dvir');
  }

  displayDefect(defects: string) {
    return defects
      .split(', ')
      .map(el => (el = this.translate.instant(el)))
      .join(', ');
  }

  getOrdinalSuffix(sday: string): string {
    let day = parseInt(sday);
    if (day >= 11 && day <= 13) {
      return this.translate.instant('th');
    }

    switch (day % 10) {
      case 1:
        return this.translate.instant('st');
      case 2:
        return this.translate.instant('nd');
      case 3:
        return this.translate.instant('rd');
      default:
        return this.translate.instant('th');
    }
  }

  ngOnDestroy(): void {
    this.interSub.unsubscribe();
  }
}
