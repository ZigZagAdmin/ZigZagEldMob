import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { LogDailies } from 'src/app/models/log-dailies';
import { LogHistories } from 'src/app/models/log-histories';
import { Storage } from '@ionic/storage';
import { DashboardService } from 'src/app/services/dashboard.service';
import { InternetService } from 'src/app/services/internet.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-hos',
  templateUrl: './hos.page.html',
  styleUrls: ['./hos.page.scss'],
})
export class HosPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  message = '';
  someErrors: boolean = false;
  bReady: boolean = false;
  databaseSubscription: Subscription | undefined;
  logDailies: LogDailies[] = [];
  logHistories: LogHistories[] = [];
  selectedButton: String = '';
  countDays: LogDailies[] = [];

  vehicleId: string = '';
  driverId: string = '';
  companyId: string = '';
  name: string = '';
  TimeZoneCity: string = '';
  networkStatus = false;
  networkSub!: Subscription;

  percentBreak = 0;
  percentDriving = 0;
  percentShift = 0;
  percentCycle = 0;
  titleBreak = 0;
  titleDriving = 0;
  titleShift = 0;
  titleCycle = 0;

  currentStatus = '';
  currentStatusTime = '';

  constructor(
    private navCtrl: NavController,
    private databaseService: DatabaseService,
    private dashboardService: DashboardService,
    private internetService: InternetService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    console.log('init hos');
    this.vehicleId = await this.storage.get('vehicleId');
    this.driverId = await this.storage.get('driverId');
    this.companyId = await this.storage.get('companyId');
    this.TimeZoneCity = await this.storage.get('TimeZoneCity');
    this.databaseSubscription =
      this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
        if (ready) {
          this.bReady = ready;
          this.databaseService.getLogDailies().subscribe((logDailies) => {
            this.logDailies = logDailies;

            let currentDate = new Date();
            for (let i = 0; i < 14; i++) {
              const dateString = currentDate.toISOString().split('T')[0];
              const foundLogDayIndex = this.logDailies.findIndex((logDay) =>
                logDay.Day.includes(dateString)
              );
              if (foundLogDayIndex !== -1) {
                this.countDays.push(this.logDailies[foundLogDayIndex]);
              } else {
                let newLogDaily = {
                  CompanyId: this.companyId,
                  Id: 0,
                  Certified: false,
                  CertifyTimestamp: '',
                  DriverId: this.driverId,
                  VehicleId: this.vehicleId,
                  LogDailiesId: this.uuidv4(),
                  DriverName: '',
                  Day: dateString + 'T00:00:00',
                  HoursOffDuty: 0,
                  HoursSleeper: 0,
                  HoursDriving: 0,
                  HoursWorked: 0,
                  HoursOnDuty: 0,
                  Violations: '',
                  FormManner: false,
                  Trailers: '',
                  ShippingDoc: '',
                  FromAddress: '',
                  ToAddress: '',
                  Signature: '',
                  Type: '',
                };
                this.countDays.push(newLogDaily);

                this.dashboardService.updateLogDaily(newLogDaily).subscribe(
                  (response) => {
                    console.log('LogDaily is updated on server:', response);
                  },
                  async (error) => {
                    console.log('Internet Status' + this.networkStatus);
                    let tempEerror = {
                      url: 'api/eldDashboard/UploadLogDailies',
                      body: newLogDaily,
                    };
                    let offlineArray = await this.storage.get('offlineArray');
                    offlineArray.push(tempEerror);
                    await this.storage.set('offlineArray', offlineArray);
                    console.log('Pushed in offlineArray');
                  }
                );
              }
              currentDate.setDate(currentDate.getDate() - 1);
            }
            console.log(this.countDays);
            this.logDailies = this.countDays;
          });

          this.databaseService.getLogHistories().subscribe((LogHistories) => {
            this.logHistories = LogHistories;
            console.log('Log Histories init', this.logHistories);
          });
        }
      });
    this.networkSub = this.internetService.internetStatus$.subscribe(
      (status) => {
        this.networkStatus = status;
        console.log('Intenet Status' + status);
      }
    );

    this.sayHello();
    this.calculateCircles();
  }

  ionViewWillEnter() {
    console.log('willEnter hos');
    this.logDailies = this.countDays;
  }

  async calculateCircles() {
    const allSt = ['OFF', 'SB', 'D', 'ON', 'IND_PC', 'IND_YM'];

    let iHoursOfServiceRulesHours = await this.storage.get(
      'HoursOfServiceRuleHours'
    );
    let iHoursOfServiceRulesDay = await this.storage.get(
      'HoursOfServiceRuleDays'
    );
    let iAvailableBreakFull = 8 * 60 * 60;
    let iAvailableDriveFull = 11 * 60 * 60;
    let iAvailableShiftFull = 14 * 60 * 60;
    let iAvailableCycleFull = iHoursOfServiceRulesHours * 60 * 60;
    let iAvailableBreak = 8 * 60 * 60;
    let iAvailableDrive = 11 * 60 * 60;
    let iAvailableShift = 14 * 60 * 60;
    let iAvailableCycle = iHoursOfServiceRulesHours * 60 * 60;
    let iProgressBreak = 0;
    let iProgressDrive = 0;
    let iProgressShift = 0;
    let iProgressCycle = 0;
    let iTime = 0;
    let iTimeBreak = 0;
    let iTimeNotDrive = 0;
    let iTimeCycle = 0;
    let iTimeON = 0;
    let iTimeD = 0;
    let iTimeOFF = 0;
    let iTimeRecap = 0;
    let iSplitSleeperBerth2or3 = 0;
    let iSplitSleeperBerth8or7 = 0;
    let iBreakReset = 0;
    let iShiftReset = 0;
    let iCycleReset = 0;
    let iBreakResetFull = 30 * 60;
    let iShiftResetFull = 10 * 60 * 60;
    let iCycleResetFull = 34 * 60 * 60;

    let sLocationDescription = '';
    let sDateBgn = '';
    let sDateEnd = '';
    let sEventTypeCode = '';
    let sEventTypeName = '';

    let bResetTimeLast7Day = false;

    this.logHistories.forEach((event) => {
      sDateBgn = event.DateBgn;
      sEventTypeCode = event.EventTypeCode;
      sEventTypeName = event.EventTypeName;

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

      console.log('iHoursOfServiceRulesHours: ', iHoursOfServiceRulesHours);
      console.log('sDateEnd: ', sDateEnd);
      console.log('TimeZoneCity: ', this.TimeZoneCity);

      iTime =
        (new Date(sDateEnd).getTime() - new Date(sDateBgn).getTime()) / 1000;
      console.log('iTime: ', iTime);

      switch (sEventTypeCode) {
        case 'OFF':
        case 'SB':
          iTimeOFF = iTimeOFF + iTime;
          iTimeNotDrive = iTimeNotDrive + iTime;

          // Split Sleeper Berth
          // 8 or 7 : Hours = Sleeper Berth
          // 2 or 3 : Hours = Sleeper Berth or Off Duty
          // Непрерывный отдых 10 часа - для сброса времени: вождения и работы
          // Можно разделить на:
          // 8/2 - 8 непрерывный отдых + (потом работа) + 2 отдыха
          // 7/3 - 7 непрерывный отдых + (потом работа) + 3 отдыха
          // 7 и 8 часов не учитываются в shift а 3 и 2 часа учитываются
          if (iTime >= 2 * 60 * 60 && iTime < 4 * 60 * 60) {
            // Не учитываем это время
            iSplitSleeperBerth2or3 = iSplitSleeperBerth2or3 + iTime;
          }

          if (
            sEventTypeCode == 'SB' &&
            iTime >= 7 * 60 * 60 &&
            iTime < 9 * 60 * 60
          ) {
            // Не учитываем это время
            iSplitSleeperBerth8or7 = iSplitSleeperBerth8or7 + iTime;
          }

          // Непрерывный отдых 34/24 часа - для сброса общего времени
          if (iTime >= iCycleResetFull) {
            iTimeCycle = 0;
            iTimeRecap = 0;
            bResetTimeLast7Day = true;
          }

          // Непрерывный отдых 10 часа - для сброса времени: вождения и работы
          if (iTime >= iShiftResetFull) {
            iTimeON = 0;
            iTimeD = 0;
            iTimeOFF = 0;
            iSplitSleeperBerth2or3 = 0;
            iSplitSleeperBerth8or7 = 0;
          }

          iShiftReset = iShiftResetFull - iTime;
          iCycleReset = iCycleResetFull - iTime;
          break;

        case 'D':
          iTimeD = iTimeD + iTime;
          iTimeBreak = iTimeBreak + iTime;
          iTimeCycle = iTimeCycle + iTime;

          iTimeNotDrive = 0;
          iShiftReset = iShiftResetFull;
          iCycleReset = iCycleResetFull;
          break;

        case 'ON':
        case 'PC':
        case 'YM':
          iTimeON = iTimeON + iTime;
          iTimeCycle = iTimeCycle + iTime;
          iTimeNotDrive = iTimeNotDrive + iTime;

          iShiftReset = iShiftResetFull;
          iCycleReset = iCycleResetFull;
          break;
      }

      // Отдых 30 минут - для сброса времени неприрывного вождения максимум 8 часов
      if (iTimeNotDrive >= iBreakResetFull) {
        iTimeBreak = 0;
      }

      iBreakReset = iBreakResetFull - iTimeNotDrive;

      console.log('sEventTypeCode: ', sEventTypeCode);

      console.log('iTimeD: ', iTimeD);
      console.log('iTimeON: ', iTimeON);
      console.log('iTimeCycle: ', iTimeCycle);
      console.log('iTimeOFF: ', iTimeOFF);
    });

    this.currentStatus = sEventTypeName;
    this.currentStatusTime = this.convertSecondToHours(iTime);

    // Нет данных в базе
    if ((sEventTypeCode = '')) {
      sEventTypeCode = 'OFF';
      this.message = 'Off Duty';
    }
    /*
    tvCurrentStatusHos.setText(localResources.getString(R.string.current_status) + " " + Utility.getEventTypeName(sEventTypeCode, localResources) + " (" + Utility.getHoursOfSeconds(iTime, false) + ")");

    switch (sEventTypeCode)
    {
        case "OFF":
            tvCurrentStatusHos.setBackgroundResource(R.color.cOffDuty);
            ibCurrentStatusHos.setBackgroundResource(R.color.cOffDuty);
            break;

        case "PC":
            tvCurrentStatusHos.setBackgroundResource(R.color.cPersonalConveyance);
            ibCurrentStatusHos.setBackgroundResource(R.color.cPersonalConveyance);
            break;

        case "SB":
            tvCurrentStatusHos.setBackgroundResource(R.color.cSleeper);
            ibCurrentStatusHos.setBackgroundResource(R.color.cSleeper);
            break;

        case "D":
            tvCurrentStatusHos.setBackgroundResource(R.color.cDriving);
            ibCurrentStatusHos.setBackgroundResource(R.color.cDriving);
            bRestMode = false;
            break;

        case "ON":
            tvCurrentStatusHos.setBackgroundResource(R.color.cOnDuty);
            ibCurrentStatusHos.setBackgroundResource(R.color.cOnDuty);
            break;

        case "YM":
            tvCurrentStatusHos.setBackgroundResource(R.color.cYardMoves);
            ibCurrentStatusHos.setBackgroundResource(R.color.cYardMoves);
            break;
    }
*/

    /*
    // Привышен лимит по времени
    if ((iAvailableBreak < iTimeBreak) ||
            (iAvailableDrive < iTimeD) ||
            (iAvailableShift < iTimeD - iTimeON) ||
            (iAvailableCycle < iTimeCycle)
    )
    {
        switch (sEventTypeCode)
        {
            case "D":
                tvCurrentStatusHos.setBackgroundResource(R.color.cRed);
                ibCurrentStatusHos.setBackgroundResource(R.color.cRed);
                break;
        }
    }*/

    if (iAvailableCycle < iTimeCycle) {
      iAvailableBreak = 0;
      iAvailableDrive = 0;
      iAvailableShift = 0;
    }

    if (iAvailableDrive < iTimeD) {
      iAvailableBreak = 0;
    }

    // iAvailableShift
    // Drive + On Duty + (Off Duty + Sleeper Berth) < 0
    // Нарушения время работы
    if (iAvailableShift - iTimeD - iTimeON - iTimeOFF < 0) {
      if (sEventTypeCode == 'OFF' || sEventTypeCode == 'SB') {
        if (iAvailableShift - iTimeD - iTimeON < 0) {
          iAvailableShift = -1;
        } else {
          if (iTimeD + iTimeON + iTimeOFF < iAvailableShift) {
            iAvailableShift = iAvailableShift - iTimeD - iTimeON - iTimeOFF;
          } else {
            iAvailableShift = 0;
          }
        }
      } else {
        if (
          iAvailableShift +
            iSplitSleeperBerth8or7 +
            iSplitSleeperBerth2or3 -
            iTimeD -
            iTimeON -
            iTimeOFF <
          0
        ) {
          iAvailableShift =
            iAvailableShift +
            iSplitSleeperBerth8or7 +
            iSplitSleeperBerth2or3 -
            iTimeD -
            iTimeON -
            iTimeOFF;
        } else {
          iAvailableShift =
            iAvailableShift +
            iSplitSleeperBerth8or7 +
            iSplitSleeperBerth2or3 -
            iTimeD -
            iTimeON -
            iTimeOFF;
        }

        iAvailableShift = iAvailableShift - iTimeD - iTimeON - iTimeOFF;
      }
    } else {
      iAvailableShift = iAvailableShift - iTimeD - iTimeON - iTimeOFF;
    }

    // Shift
    if (iAvailableShift >= 0) {
      iProgressShift = (100 * iAvailableShift) / iAvailableShiftFull;
      this.percentShift = iProgressShift;
      this.titleShift = iAvailableShift;
    } else {
      iProgressShift = (100 * -iAvailableShift) / iAvailableShiftFull;
      this.percentShift = iProgressShift;
      this.titleShift = iAvailableShift;
    }

    // Drive
    iAvailableDrive = iAvailableDrive - iTimeD;
    if (iAvailableDrive >= 0) {
      iProgressDrive = (100 * iAvailableDrive) / iAvailableDriveFull;
      this.percentDriving = iProgressDrive;
      this.titleDriving = iAvailableDrive;
    } else {
      iProgressDrive = (100 * -iAvailableDrive) / iAvailableDriveFull;
      this.percentDriving = iProgressDrive;
      this.titleDriving = iAvailableDrive;
    }

    // iAvailableBreak
    iAvailableBreak = iAvailableBreak - iTimeBreak;
    if (iAvailableBreak >= 0) {
      iProgressBreak = (100 * iAvailableBreak) / iAvailableBreakFull;
      this.percentBreak = iProgressBreak;
      this.titleBreak = iAvailableBreak;
    } else {
      iProgressBreak = (100 * -iAvailableBreak) / iAvailableBreakFull;
      this.percentBreak = iProgressBreak;
      this.titleBreak = iAvailableBreak;
    }

    // iAvailableCycle
    iAvailableCycle = iAvailableCycle - iTimeCycle;
    if (iAvailableCycle >= 0) {
      iProgressCycle = (100 * iAvailableCycle) / iAvailableCycleFull;
      this.percentCycle = iProgressCycle;
      this.titleCycle = iAvailableCycle;
    } else {
      iProgressCycle = (100 * -iAvailableCycle) / iAvailableCycleFull;
      this.percentCycle = iProgressCycle;
      this.titleCycle = iAvailableCycle;
    }

    console.log('iAvailableBreak: ', iAvailableBreak);
    console.log('iAvailableDrive: ', iAvailableDrive);
    console.log('iAvailableShift: ', iAvailableShift);
    console.log('iAvailableCycle: ', iAvailableCycle);

    /////
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

  convertSecondToHours(secs: number): string {
    let sSign: string;
    let sHours: string;
    let sMinutes: string;

    if (secs < 0) {
      sSign = '-';
      secs = -secs;
    } else {
      sSign = '';
    }

    sHours = (
      Math.trunc((secs / (60 * 60 * 24)) % 24) * 24 +
      Math.trunc((secs / (60 * 60)) % 24)
    ).toString();
    sMinutes = (Math.trunc(secs / 60) % 60).toString();

    if (sHours.length === 0) {
      sHours = '00';
    }

    if (sHours.length === 1) {
      sHours = '0' + sHours;
    }

    if (sMinutes.length === 0) {
      sMinutes = '0';
    }

    if (sMinutes.length === 1) {
      sMinutes = '0' + sMinutes;
    }

    return sSign + sHours + ':' + sMinutes;
  }

  updateLogDailies() {
    console.log('updating...');
    let currentDate = new Date();
    this.countDays = [];
    for (let i = 0; i < 14; i++) {
      const dateString = currentDate.toISOString().split('T')[0];
      const foundLogDayIndex = this.logDailies.findIndex((logDay) =>
        logDay.Day.includes(dateString)
      );
      if (foundLogDayIndex !== -1) {
        this.countDays.push(this.logDailies[foundLogDayIndex]);
      } else {
        let newLogDaily = {
          CompanyId: this.companyId,
          Id: 0,
          Certified: false,
          CertifyTimestamp: '',
          DriverId: this.driverId,
          VehicleId: this.vehicleId,
          LogDailiesId: this.uuidv4(),
          DriverName: '',
          Day: dateString + 'T00:00:00',
          HoursOffDuty: 0,
          HoursSleeper: 0,
          HoursDriving: 0,
          HoursWorked: 0,
          HoursOnDuty: 0,
          Violations: '',
          FormManner: false,
          Trailers: '',
          ShippingDoc: '',
          FromAddress: '',
          ToAddress: '',
          Signature: '',
          Type: '',
        };
        this.countDays.push(newLogDaily);

        this.dashboardService.updateLogDaily(newLogDaily).subscribe(
          (response) => {
            console.log('LogDaily is updated on server:', response);
          },
          async (error) => {
            console.log('Internet Status' + this.networkStatus);
            let tempEerror = {
              url: 'api/eldDashboard/UploadLogDailies',
              body: newLogDaily,
            };
            let offlineArray = await this.storage.get('offlineArray');
            offlineArray.push(tempEerror);
            await this.storage.set('offlineArray', offlineArray);
            console.log('Pushed in offlineArray');
          }
        );
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    console.log(this.countDays);
    this.logDailies = this.countDays;
  }

  sayHello() {
    setInterval(() => {
      this.updateLogDailies();
      this.calculateCircles();
    }, 60000);
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
    this.networkSub.unsubscribe();
  }
}
