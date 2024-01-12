import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventGraphic } from 'src/app/models/event-graphic';
import { LogDailies } from 'src/app/models/log-dailies';
import { LogHistories } from 'src/app/models/log-histories';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { formatDate } from '@angular/common';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inspection-preview',
  templateUrl: './inspection-preview.page.html',
  styleUrls: ['./inspection-preview.page.scss'],
})
export class InspectionPreviewPage implements OnInit {
  LogDailiesId!: string | null;
  bReady: boolean = false;
  TimeZoneCity: string = '';
  PickedVehicle: string = '';
  logDailies: LogDailies[] = [];
  logHistories: LogHistories[] = [];
  logDaily: LogDailies | undefined;
  currentDay: string | undefined = '';
  graphicsHour = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  statusesOnDay: LogHistories[] = [];
  xBgn!: number;
  yBgn!: number;
  xEnd!: number;
  yEnd!: number;
  xBgnV!: number;
  yBgnV!: number;
  eventGraphicLine: EventGraphic[] = [];
  databaseSubscription: Subscription | undefined;
  driverId: string = '';
  vehicleId: string = '';
  previousPage!: string | null;
  today = new Date();

  constructor(private activatedRoute: ActivatedRoute, private databaseService: DatabaseService, private storage: Storage, private toastController: ToastController, private navCtrl: NavController) {}

  async ngOnInit() {
    this.vehicleId = await this.storage.get('vehicleId');
    this.driverId = await this.storage.get('driverId');
    this.PickedVehicle = await this.storage.get('pickedVehicle');
    this.TimeZoneCity = await this.storage.get('TimeZoneCity');
    this.activatedRoute.paramMap.subscribe(params => {
      this.LogDailiesId = params.get('logId');
      this.previousPage = params.get('page');
      console.log(this.LogDailiesId);
    });
    this.databaseSubscription = this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
      if (ready) {
        this.bReady = ready;
        this.databaseService.getLogDailies().subscribe(logDailies => {
          this.logDailies = logDailies;
          if (this.previousPage === 'inspection') {
            this.logDailies = logDailies.slice(0, 7);
          }
          if (this.logDaily) {
            this.logDaily = this.logDailies.find(item => item.logDailyId === this.LogDailiesId);
          }
        });
        this.databaseService.getLogHistories().subscribe(logHistories => {
          this.logHistories = logHistories;
          this.logHistories.forEach(log => {
            if (log.DateEnd === '0001-01-01T00:00:00') {
              log.DateEnd = formatDate(
                new Date().toLocaleString('en-US', {
                  timeZone: this.TimeZoneCity,
                }),
                'yyyy-MM-ddTHH:mm:ss',
                'en_US'
              );
            }
          });
          console.log(this.logHistories);
          this.drawGraph();
        });
      }
    });
  }

  drawGraph() {
    const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];
    this.eventGraphicLine = [];
    this.statusesOnDay = [];
    let dateBgn = null;
    let dateEnd = null;
    let sDateEnd = '';
    this.xBgn = 0;
    this.xEnd = 0;
    this.xBgnV = 0;
    this.yBgnV = 0;

    this.currentDay = this.logDaily?.logDate;

    this.logHistories.forEach(event => {
      if (allSt.includes(event.EventTypeCode)) {
        sDateEnd = event.DateEnd;
        if (sDateEnd == '0001-01-01T00:00:00') {
          sDateEnd = formatDate(
            new Date().toLocaleString('en-US', {
              timeZone: this.TimeZoneCity,
            }),
            'yyyy-MM-ddTHH:mm:ss',
            'en_US'
          );
        }

        if (
          formatDate(new Date(event.DateBgn), 'yyyy-MM-dd', 'en_US') <= formatDate(new Date(this.currentDay as string), 'yyyy-MM-dd', 'en_US') &&
          formatDate(new Date(this.currentDay as string), 'yyyy-MM-dd', 'en_US') <= formatDate(new Date(sDateEnd), 'yyyy-MM-dd', 'en_US')
        ) {
          console.log('event', event);

          dateBgn = new Date(event.DateBgn);
          console.log(dateBgn.toLocaleDateString());
          console.log(new Date(this.currentDay as string).toLocaleDateString());
          if (dateBgn.toLocaleDateString() === new Date(this.currentDay as string).toLocaleDateString()) {
            this.xBgn = dateBgn.getHours() * 60 + dateBgn.getMinutes();
          } else {
            this.xBgn = 0;
          }

          console.log('X BEGIN =', this.xBgn);

          dateEnd = new Date(sDateEnd);

          if (dateEnd.toLocaleDateString() === new Date(this.currentDay as string).toLocaleDateString()) {
            this.xEnd = dateEnd.getHours() * 60 + dateEnd.getMinutes();
          } else {
            this.xEnd = 1440;
          }
          console.log('X END =', this.xEnd);

          switch (event.EventTypeCode) {
            case 'OFF':
            case 'PC':
              this.yBgn = 25;
              this.yEnd = 25;
              break;

            case 'SB':
              this.yBgn = 75;
              this.yEnd = 75;
              break;

            case 'D':
              this.yBgn = 125;
              this.yEnd = 125;
              break;

            case 'ON':
            case 'YM':
              this.yBgn = 175;
              this.yEnd = 175;
              break;
          }

          switch (event.EventTypeCode) {
            case 'OFF':
              this.eventGraphicLine.push({
                x1: this.xBgn,
                y1: this.yBgn,
                x2: this.xEnd,
                y2: this.yEnd,
                yV: this.yBgnV,
                class: 'eventStatusOFF',
                name: '',
                historyId: event.LogHistoriesId,
                status: 0,
                statusClick: 0,
              });
              break;

            case 'SB':
              this.eventGraphicLine.push({
                x1: this.xBgn,
                y1: this.yBgn,
                x2: this.xEnd,
                y2: this.yEnd,
                yV: this.yBgnV,
                class: 'eventStatusSB',
                name: '',
                historyId: event.LogHistoriesId,
                status: 0,
                statusClick: 0,
              });
              break;

            case 'D':
              this.eventGraphicLine.push({
                x1: this.xBgn,
                y1: this.yBgn,
                x2: this.xEnd,
                y2: this.yEnd,
                yV: this.yBgnV,
                class: 'eventStatusD',
                name: '',
                historyId: event.LogHistoriesId,
                status: 0,
                statusClick: 0,
              });
              break;

            case 'ON':
              this.eventGraphicLine.push({
                x1: this.xBgn,
                y1: this.yBgn,
                x2: this.xEnd,
                y2: this.yEnd,
                yV: this.yBgnV,
                class: 'eventStatusON',
                name: '',
                historyId: event.LogHistoriesId,
                status: 0,
                statusClick: 0,
              });
              break;

            case 'PC':
              this.eventGraphicLine.push({
                x1: this.xBgn,
                y1: this.yBgn,
                x2: this.xEnd,
                y2: this.yEnd,
                yV: this.yBgnV,
                class: 'eventStatusPC',
                name: '',
                historyId: event.LogHistoriesId,
                status: 0,
                statusClick: 0,
              });
              break;

            case 'YM':
              this.eventGraphicLine.push({
                x1: this.xBgn,
                y1: this.yBgn,
                x2: this.xEnd,
                y2: this.yEnd,
                yV: this.yBgnV,
                class: 'eventStatusYM',
                name: '',
                historyId: event.LogHistoriesId,
                status: 0,
                statusClick: 0,
              });
              break;
          }

          this.xBgnV = this.xEnd;
          this.yBgnV = this.yEnd;
          this.statusesOnDay.push(event);
        }
      }
    });
  }

  goToNextLog() {
    const currentIndex = this.logDailies.findIndex(item => item.logDailyId === this.logDaily?.logDailyId);
    const nextIndex = currentIndex + 1;

    if (nextIndex < this.logDailies.length) {
      this.logDaily = this.logDailies[nextIndex];
      this.drawGraph();
    }
  }

  goToPreviousLog() {
    const currentIndex = this.logDailies.findIndex(item => item.logDailyId === this.logDaily?.logDailyId);
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      this.logDaily = this.logDailies[previousIndex];
      this.drawGraph();
    }
  }

  private async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      color: color,
    });
    toast.present();
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
  }

  goBack() {
    this.navCtrl.navigateBack('unitab/inspection');
  }
}
