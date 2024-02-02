import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DVIRs } from 'src/app/models/dvirs';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dvir',
  templateUrl: './dvir.page.html',
  styleUrls: ['./dvir.page.scss'],
})
export class DvirPage implements OnInit, OnDestroy {
  bLoading: boolean = true;
  bReady: boolean = false;
  dvirs: DVIRs[] = [];
  databaseSubscription: Subscription | undefined;
  paramsSubscription!: Subscription;
  pickedVehicle: String = '';
  constructor(private route: ActivatedRoute, private navCtrl: NavController, private databaseService: DatabaseService) {}

  async ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(async params => {
      await this.databaseService
        .getDvirs()
        .toPromise()
        .then(dvirs => {
          this.dvirs = dvirs;
        });
    });
  }

  editDvir(dvir: DVIRs) {
    this.navCtrl.navigateForward('/edit-dvir', { queryParams: { dvirId: dvir.dvirId } });
  }

  insertDvir() {
    this.navCtrl.navigateForward('/insert-dvir');
  }

  ionViewWillLeave() {
    this.paramsSubscription.unsubscribe();
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }
}
