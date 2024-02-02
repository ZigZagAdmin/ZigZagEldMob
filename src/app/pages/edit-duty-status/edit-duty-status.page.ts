import { formatDate } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EventGraphic } from 'src/app/models/event-graphic';
import { LogDailies } from 'src/app/models/log-dailies';
import { LogEvents } from 'src/app/models/log-histories';

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
  currentDay: string | undefined = '';
  logDaily: LogDailies | undefined;

  statusesOnDay: LogEvents[] = [];
  xBgn!: number;
  yBgn!: number;
  xEnd!: number;
  yEnd!: number;
  xBgnV!: number;
  yBgnV!: number;
  timeZone: string;
  logEvents: LogEvents[] = [];

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

    this.logEvents.forEach(event => {
      if (allSt.includes(event.type.code)) {
        if (event.eventTime.timeStampEnd) sDateEnd = new Date(event.eventTime.timeStampEnd).toISOString();
        else sDateEnd = new Date().toISOString();

        if (sDateEnd == '0001-01-01T00:00:00') {
          sDateEnd = formatDate(
            new Date().toLocaleString('en-US', {
              timeZone: this.timeZone,
            }),
            'yyyy-MM-ddTHH:mm:ss',
            'en_US'
          );
        }

        if (
          formatDate(new Date(event.eventTime.timeStamp), 'yyyy-MM-dd', 'en_US') <= formatDate(new Date(this.currentDay), 'yyyy-MM-dd', 'en_US') &&
          formatDate(new Date(this.currentDay), 'yyyy-MM-dd', 'en_US') <= formatDate(new Date(sDateEnd), 'yyyy-MM-dd', 'en_US')
        ) {
          dateBgn = new Date(event.eventTime.timeStamp);
          if (dateBgn.toLocaleDateString() === new Date(this.currentDay as string).toLocaleDateString()) {
            this.xBgn = dateBgn.getHours() * 60 + dateBgn.getMinutes();
          } else {
            this.xBgn = 0;
          }


          dateEnd = new Date(sDateEnd);

          if (dateEnd.toLocaleDateString() === new Date(this.currentDay as string).toLocaleDateString()) {
            this.xEnd = dateEnd.getHours() * 60 + dateEnd.getMinutes();
          } else {
            this.xEnd = 1440;
          }

          switch (event.type.code) {
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

          switch (event.type.code) {
            case 'OFF':
              this.eventGraphicLine.push({
                x1: this.xBgn,
                y1: this.yBgn,
                x2: this.xEnd,
                y2: this.yEnd,
                yV: this.yBgnV,
                class: 'eventStatusOFF',
                name: '',
                historyId: event.logEventId,
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
                historyId: event.logEventId,
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
                historyId: event.logEventId,
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
                historyId: event.logEventId,
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
                historyId: event.logEventId,
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
                historyId: event.logEventId,
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
