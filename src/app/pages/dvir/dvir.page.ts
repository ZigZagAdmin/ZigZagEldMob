import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DVIRs } from 'src/app/models/dvirs';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dvir',
  templateUrl: './dvir.page.html',
  styleUrls: ['./dvir.page.scss'],
})
export class DvirPage implements OnInit {
  bLoading: boolean = true;
  bReady: boolean = false;
  dvirs: DVIRs[] = [];
  databaseSubscription: Subscription | undefined;
  pickedVehicle: String = '';
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
            .getDvirs()
            .subscribe((dvirs) => {
              this.dvirs = dvirs;
              this.bLoading = false;
            });
        }
      });
  }

  ionViewWillEnter() {
    console.log('willEnter dvirs');
    if (this.bReady) {
      this.databaseSubscription = this.databaseService
        .getDvirs()
        .subscribe((dvirs) => {
          this.dvirs = dvirs;
          console.log(this.dvirs);
        });
    }
  }

  ionViewDidEnter() {
    console.log('didEnter dvirs');
    if (this.bReady) {
      this.databaseSubscription = this.databaseService
        .getDvirs()
        .subscribe((dvirs) => {
          this.dvirs = dvirs;
        });
    }
  }

  editDvir(dvir: DVIRs) {
    console.log(dvir.DVIRId);
    this.navCtrl.navigateForward(['/edit-dvir', { dvirId: dvir.DVIRId }]);
  }

  insertDvir() {
    this.navCtrl.navigateForward('/insert-dvir');
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
  }
}
