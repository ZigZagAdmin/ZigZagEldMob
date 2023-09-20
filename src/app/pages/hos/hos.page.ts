import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription, forkJoin } from 'rxjs';
import { NavController } from '@ionic/angular';
import { LogDailies } from 'src/app/models/log-dailies';
import { LogHistories } from 'src/app/models/log-histories';
import { Storage } from '@ionic/storage';
import { DashboardService } from 'src/app/services/dashboard.service';
import { InternetService } from 'src/app/services/internet.service';
import { formatDate } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Vehicle } from 'src/app/models/vehicle';

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
  countDays: LogDailies[] = [];

  selectedButton: string = '';
  progressBreak = 0;
  progressShift = 0;
  progressCycle = 0;

  isModalOpen!: boolean;
  isConfirmButtonActive: boolean = true;
  vehicleId: string = '';
  driverId: string = '';
  companyId: string = '';
  name: string = '';
  pickedVehicle: string = '';
  TimeZoneCity: string = '';
  networkStatus = false;
  networkSub!: Subscription;
  paramsSubscription!: Subscription;
  bAuthorized!: boolean;

  percentBreak = 0;
  percentDriving = 0;
  percentShift = 0;
  percentCycle = 0;
  titleBreak = 0;
  titleDriving = 0;
  titleShift = 0;
  titleCycle = 0;

  redCircle = 0;

  restBreak = '';
  restShift = '';
  restCycle = '';

  currentStatus = { statusCode: '', statusName: '' };
  currentStatusTime = '';

  vehicle!: Vehicle
  location = ''
  comments = ''

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private dashboardService: DashboardService,
    private internetService: InternetService,
    private storage: Storage,
    public modalController: ModalController,
    private storageService: DatabaseService
  ) {}

  async ngOnInit() {
    this.getVehicle()
    console.log('init hos');
    this.vehicleId = await this.storage.get('vehicleId');
    this.driverId = await this.storage.get('driverId');
    this.companyId = await this.storage.get('companyId');
    this.TimeZoneCity = await this.storage.get('TimeZoneCity');
    this.bAuthorized = await this.storage.get('bAuthorized');
    this.name = await this.storage.get('name');
    this.pickedVehicle = await this.storage.get('pickedVehicle');
    this.databaseSubscription =
      this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
        if (ready) {
          this.bReady = ready;

          const logDailies$ = this.databaseService.getLogDailies();
          const logHistories$ = this.databaseService.getLogHistories();

          forkJoin([logDailies$, logHistories$]).subscribe(
            ([logDailies, logHistories]) => {
              this.logDailies = logDailies;
              this.logHistories = logHistories;

              if (this.bAuthorized === false) {
                const lastLogHistory =
                  this.logHistories[this.logHistories.length - 1];

                lastLogHistory.DateEnd = formatDate(
                  new Date().toLocaleString('en-US', {
                    timeZone: this.TimeZoneCity,
                  }),
                  'yyyy-MM-ddTHH:mm:ss',
                  'en_US'
                );

                let LoginLogHistory: LogHistories = {
                  City: '',
                  CoDriverId: '',
                  Comment: '',
                  CountryCode: '',
                  DataDiagnosticEvent: false,
                  DateBgn: formatDate(
                    new Date().toLocaleString('en-US', {
                      timeZone: this.TimeZoneCity,
                    }),
                    'yyyy-MM-ddTHH:mm:ss',
                    'en_US'
                  ),
                  DateEnd: formatDate(
                    new Date().toLocaleString('en-US', {
                      timeZone: this.TimeZoneCity,
                    }),
                    'yyyy-MM-ddTHH:mm:ss',
                    'en_US'
                  ),
                  DistanceSince: 0,
                  DriverId: this.driverId,
                  ELDId: '00000000-0000-0000-0000-000000000000',
                  EngineHours: 0,
                  EventDataCheck: '',
                  EventRecordOriginCode: 'DRIVER',
                  EventRecordOriginName: 'Driver',
                  EventRecordStatusCode: 'ACTIVE',
                  EventRecordStatusName: 'Active',
                  EventSequenceNumber: lastLogHistory
                    ? lastLogHistory.EventSequenceNumber + 1
                    : 1,
                  EventTypeCode: 'LOGIN',
                  EventTypeName: 'Login',
                  EventTypeType: 'LOGIN',
                  Latitude: 0,
                  LocationDescription: '2mi from Chisinau, Chisinau',
                  LocationDescriptionManual: '',
                  LocationSourceCode: 'AUTOMATIC',
                  LocationSourceName:
                    'Location generated when connected to ECM',
                  LogDailiesId: '',
                  LogHistoriesId: this.uuidv4(),
                  Longitude: 0,
                  Malfunction: false,
                  Odometer: 0,
                  PositioningCode: 'AUTOMATIC',
                  PositioningName: 'Automatic',
                  SendLogToInspector: false,
                  StateProvinceCode: '',
                  VehicleId: this.vehicleId,
                };
                this.logHistories.push(LoginLogHistory);
                this.storage.set('bAuthorized', true);
                this.storage.set('logHistories', this.logHistories);

                this.dashboardService
                  .updateLogHistory(LoginLogHistory)
                  .subscribe(
                    (response) => {
                      console.log(
                        'Login LogHistory is updated on server:',
                        response
                      );
                    },
                    async (error) => {
                      console.log('Internet Status' + this.networkStatus);
                      let tempEerror = {
                        url: 'api/eldDashboard/UploadLogHistories',
                        body: LoginLogHistory,
                      };
                      let offlineArray = await this.storage.get('offlineArray');
                      offlineArray.push(tempEerror);
                      await this.storage.set('offlineArray', offlineArray);
                      console.log('Login LogHistory Pushed in offlineArray');
                    }
                  );

                this.dashboardService
                  .updateLogHistory(lastLogHistory)
                  .subscribe(
                    (response) => {
                      console.log(
                        'Predposlednii LogHistory is updated on server:',
                        response
                      );
                    },
                    async (error) => {
                      console.log('Internet Status' + this.networkStatus);
                      let tempEerror = {
                        url: 'api/eldDashboard/UploadLogHistories',
                        body: lastLogHistory,
                      };
                      let offlineArray = await this.storage.get('offlineArray');
                      offlineArray.push(tempEerror);
                      await this.storage.set('offlineArray', offlineArray);
                      console.log(
                        'Predposlednii LogHistory Pushed in offlineArray'
                      );
                    }
                  );
              }
              this.updateLogDailies();
            }
          );
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

    this.paramsSubscription = this.route.params.subscribe((params) => {
      console.log('after ngOnInit dvir');
      if (this.bReady) {
        this.databaseSubscription = this.databaseService
          .getLogDailies()
          .subscribe((logDailies) => {
            this.logDailies = logDailies;
          });
      }
    });
  }

  getVehicle() {
    this.storageService.getVehicles().subscribe(res => {
      this.vehicle = res[0]
    }, error => console.log(error))
  }

  // Вызывайте эту функцию при заходе на страницу или событии, когда вам нужно местоположение.

  ionViewWillEnter() {
    console.log('willEnter hos');
    this.logDailies = this.countDays;
  }

  toggleMode() {
    const driveModeContainer = document.getElementById('driveModeContainer');
    const restModeContainer = document.getElementById('restModeContainer');
    const button = document.querySelector('.drive_mode ion-button');

    if (driveModeContainer && restModeContainer && button) {
      if (driveModeContainer.style.display === 'none') {
        driveModeContainer.style.display = 'block';
        restModeContainer.style.display = 'none';
      } else {
        driveModeContainer.style.display = 'none';
        restModeContainer.style.display = 'block';
      }
    }
  }

  async calculateCircles() {
    const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];

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
      if (allSt.includes(event.EventTypeCode)) {
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

        // console.log('iHoursOfServiceRulesHours: ', iHoursOfServiceRulesHours);
        // console.log('sDateEnd: ', sDateEnd);
        // console.log('TimeZoneCity: ', this.TimeZoneCity);

        iTime =
          (new Date(sDateEnd).getTime() - new Date(sDateBgn).getTime()) / 1000;
        // console.log('iTime: ', iTime);

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

        // console.log('sEventTypeCode: ', sEventTypeCode);

        // console.log('iTimeD: ', iTimeD);
        // console.log('iTimeON: ', iTimeON);
        // console.log('iTimeCycle: ', iTimeCycle);
        // console.log('iTimeOFF: ', iTimeOFF);
      }
    });

    this.currentStatus.statusCode = sEventTypeCode;
    this.currentStatus.statusName = sEventTypeName;
    this.currentStatusTime = this.convertSecondToHours(iTime);

    this.restBreak = this.convertSecondToHours(0);
    this.restShift = this.convertSecondToHours(0);
    this.restCycle = this.convertSecondToHours(0);

    if (iBreakReset >= 0) {
      this.restBreak = this.convertSecondToHours(iBreakReset);
      this.progressBreak = (100 * iBreakReset) / (30 * 60) / 100;
    }

    if (iShiftReset >= 0) {
      this.restShift = this.convertSecondToHours(iShiftReset);
      this.progressShift = (100 * iShiftReset) / (10 * 60 * 60) / 100;
      // console.log('Shift Reset = ', iShiftReset);
      // console.log('progressShify = ', this.progressShift);
    }

    if (iCycleReset >= 0) {
      this.restCycle = this.convertSecondToHours(iCycleReset);
      this.progressCycle = (100 * iCycleReset) / (34 * 60 * 60) / 100;
    }

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
      this.redCircle += 0;
      console.log(iProgressShift);
    } else {
      iProgressShift = (100 * -iAvailableShift) / iAvailableShiftFull;
      iAvailableShift = iAvailableShiftFull + iAvailableShift;
      this.percentShift = iProgressShift;
      this.titleShift = iAvailableShift;
      this.redCircle += 1;
    }

    // Drive
    iAvailableDrive = iAvailableDrive - iTimeD;
    if (iAvailableDrive >= 0) {
      iProgressDrive = (100 * iAvailableDrive) / iAvailableDriveFull;
      this.percentDriving = iProgressDrive;
      this.titleDriving = iAvailableDrive;
      this.redCircle += 0;
    } else {
      iAvailableDrive = iAvailableDriveFull - iAvailableDrive;
      iProgressDrive = (100 * -iAvailableDrive) / iAvailableDriveFull;
      this.percentDriving = iProgressDrive;
      this.titleDriving = -iAvailableDrive;
      this.redCircle += 1;
    }

    // iAvailableBreak
    iAvailableBreak = iAvailableBreak - iTimeBreak;
    if (iAvailableBreak >= 0) {
      iProgressBreak = (100 * iAvailableBreak) / iAvailableBreakFull;
      this.percentBreak = iProgressBreak;
      this.titleBreak = iAvailableBreak;
      this.redCircle += 0;
    } else {
      iProgressBreak = (100 * -iAvailableBreak) / iAvailableBreakFull;
      iAvailableBreak = iAvailableBreakFull - iAvailableBreak;
      this.percentBreak = iProgressBreak;
      this.titleBreak = -iAvailableBreak;
      this.redCircle += 1;
      console.log(this.percentBreak);
    }

    // iAvailableCycle
    iAvailableCycle = iAvailableCycle - iTimeCycle;
    if (iAvailableCycle >= 0) {
      iProgressCycle = (100 * iAvailableCycle) / iAvailableCycleFull;
      this.percentCycle = iProgressCycle;
      this.titleCycle = iAvailableCycle;
      this.redCircle += 0;
    } else {
      iAvailableCycle = iAvailableCycleFull - iAvailableCycle;
      iProgressCycle = (100 * iAvailableCycle) / iAvailableCycleFull;
      this.percentCycle = iProgressCycle;
      this.titleCycle = -iAvailableCycle;
      this.redCircle += 1;
    }

    console.log('iAvailableBreak: ', iAvailableBreak);
    console.log('iAvailableDrive: ', iAvailableDrive);
    console.log('iAvailableShift: ', iAvailableShift);
    console.log('iAvailableCycle: ', iAvailableCycle);

    /////
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Off Duty':
        return 'light';
      case 'Driving':
        return 'success';
      case 'On Duty':
        return 'warning';
      case 'Yard Moves':
        return 'warning';
      case 'Sleeper Berth':
        return 'medium';
      case 'Personal Conveyance':
        return 'success';
      default:
        return 'medium';
    }
  }

  toggleModal() {
    this.isModalOpen = true; // Открываем модальное окно

    // При открытии модального окна, устанавливаем состояние выбранных кнопок и кнопки Confirm
    if (this.currentStatus) {
      this.selectButton(this.currentStatus.statusCode);
    }
  }

  selectLog(log: LogDailies) {
    this.navCtrl.navigateForward(['/log-item', { logId: log.LogDailiesId }]);
  }

  selectButton(button: string) {
    this.selectedButton = button;
    console.log(this.selectedButton);
    if (this.selectedButton === this.currentStatus.statusCode) {
      this.isConfirmButtonActive = false;
    } else {
      this.isConfirmButtonActive = true;
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.isModalOpen = false;
  }

  async confirm() {
    if (this.selectedButton) {
      await this.modal.dismiss(this.selectedButton, 'confirm');
    }
    this.isModalOpen = false;
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];
      const filteredLogHistories = this.logHistories.filter((item) =>
        allSt.includes(item.EventTypeCode)
      );
      let lastLogHistory =
        filteredLogHistories[filteredLogHistories.length - 1];
      if (lastLogHistory) {
        const currentDate = formatDate(
          new Date().toLocaleString('en-US', {
            timeZone: this.TimeZoneCity,
          }),
          'yyyy-MM-ddTHH:mm:ss',
          'en_US'
        );
        lastLogHistory.DateEnd = currentDate;
        console.log('LAST LOGHISTORY = ', lastLogHistory);
      }

      let statuses = {
        OFF: {
          statusName: 'Off Duty',
          eventTypeType: 'DUTY_STATUS',
        },
        SB: {
          statusName: 'Sleeper Berth',
          eventTypeType: 'DUTY_STATUS',
        },
        D: {
          statusName: 'Driving',
          eventTypeType: 'DUTY_STATUS',
        },
        ON: {
          statusName: 'On Duty',
          eventTypeType: 'DUTY_STATUS',
        },
        PC: {
          statusName: 'Personal Conveyance',
          eventTypeType: 'DRIVER_INDICATES',
        },
        YM: {
          statusName: 'Yard Moves',
          eventTypeType: 'DRIVER_INDICATES',
        },
      };

      let newLogHistory: LogHistories = {
        City: '',
        CoDriverId: '',
        Comment: '',
        CountryCode: '',
        DataDiagnosticEvent: false,
        DateBgn: formatDate(
          new Date().toLocaleString('en-US', {
            timeZone: this.TimeZoneCity,
          }),
          'yyyy-MM-ddTHH:mm:ss',
          'en_US'
        ),
        DateEnd: '0001-01-01T00:00:00',
        DistanceSince: 0,
        DriverId: this.driverId,
        ELDId: '00000000-0000-0000-0000-000000000000',
        EngineHours: 0,
        EventDataCheck: '',
        EventRecordOriginCode: 'DRIVER',
        EventRecordOriginName: 'Driver',
        EventRecordStatusCode: 'ACTIVE',
        EventRecordStatusName: 'Active',
        EventSequenceNumber: lastLogHistory
          ? lastLogHistory.EventSequenceNumber + 1
          : 1,
        EventTypeCode: this.selectedButton,
        EventTypeName: statuses[this.selectedButton as keyof typeof statuses]
          ? statuses[this.selectedButton as keyof typeof statuses].statusName
          : 'Unknown',
        EventTypeType: statuses[this.selectedButton as keyof typeof statuses]
          ? statuses[this.selectedButton as keyof typeof statuses].eventTypeType
          : 'Unknown',
        Latitude: 0,
        LocationDescription: '2mi from Chisinau, Chisinau',
        LocationDescriptionManual: '',
        LocationSourceCode: 'AUTOMATIC',
        LocationSourceName: 'Location generated when connected to ECM',
        LogDailiesId: '',
        LogHistoriesId: this.uuidv4(),
        Longitude: 0,
        Malfunction: false,
        Odometer: 0,
        PositioningCode: 'AUTOMATIC',
        PositioningName: 'Automatic',
        SendLogToInspector: false,
        StateProvinceCode: '',
        VehicleId: this.vehicleId,
      };
      this.logHistories.push(newLogHistory);
      this.storage.set('logHistories', this.logHistories);
      this.updateLogDailies();
      this.calculateCircles();

      this.dashboardService.updateLogHistory(lastLogHistory).subscribe(
        (response) => {
          console.log('Last LogHistory is updated on server:', response);
        },
        async (error) => {
          console.log('Internet Status' + this.networkStatus);
          let tempEerror = {
            url: 'api/eldDashboard/UploadLogHistories',
            body: lastLogHistory,
          };
          let offlineArray = await this.storage.get('offlineArray');
          offlineArray.push(tempEerror);
          await this.storage.set('offlineArray', offlineArray);
          console.log('Last   LogHistory Pushed in offlineArray');
        }
      );

      this.dashboardService.updateLogHistory(newLogHistory).subscribe(
        (response) => {
          console.log('New status is updated on server:', response);
        },
        async (error) => {
          console.log('Internet Status' + this.networkStatus);
          let tempEerror = {
            url: 'api/eldDashboard/UploadLogHistories',
            body: newLogHistory,
          };
          let offlineArray = await this.storage.get('offlineArray');
          offlineArray.push(tempEerror);
          await this.storage.set('offlineArray', offlineArray);
          console.log('New status Pushed in offlineArray');
        }
      );
    }
    this.isModalOpen = false;
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

      console.log(dateString);
      console.log(foundLogDayIndex);
      console.log(this.logDailies[foundLogDayIndex]);

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
    this.logDailies = this.countDays;

    ///////////////////////////////////////////////////////

    const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];

    let dateBgn = null;
    let dateEnd = null;
    let xBgn = 0;
    let xEnd = 0;

    let durationsOFF = 0;
    let durationsSB = 0;
    let durationsD = 0;
    let durationsON = 0;

    let durationsBaseOFF = 0;
    let durationsBaseSB = 0;
    let durationsBaseD = 0;
    let durationsBaseON = 0;
    let hoursWorked = 0;
    let logHistoriesForCurrencDay = [];

    console.log(this.logDailies);
    for (let i = 0; i < this.logDailies.length; i++) {
      let currentDay = this.logDailies[i].Day;
      console.log(currentDay);

      durationsOFF = 0;
      durationsSB = 0;
      durationsD = 0;
      durationsON = 0;

      durationsBaseOFF = this.logDailies[i].HoursOffDuty;
      durationsBaseSB = this.logDailies[i].HoursSleeper;
      durationsBaseD = this.logDailies[i].HoursDriving;
      durationsBaseON = this.logDailies[i].HoursOnDuty;

      this.logHistories.forEach((event) => {
        if (allSt.includes(event.EventTypeCode)) {
          if (
            formatDate(new Date(event.DateBgn), 'yyyy-MM-dd', 'en_US') <=
              formatDate(new Date(currentDay), 'yyyy-MM-dd', 'en_US') &&
            formatDate(new Date(currentDay), 'yyyy-MM-dd', 'en_US') <=
              formatDate(new Date(event.DateEnd), 'yyyy-MM-dd', 'en_US')
          ) {
            console.log('event', event);

            dateBgn = new Date(event.DateBgn);
            if (
              dateBgn.toLocaleDateString() ===
              new Date(currentDay).toLocaleDateString()
            ) {
              xBgn = dateBgn.getHours() * 60 + dateBgn.getMinutes();
            } else {
              xBgn = 0;
            }

            dateEnd = new Date(event.DateEnd);
            if (
              dateEnd.toLocaleDateString() ===
              new Date(currentDay).toLocaleDateString()
            ) {
              xEnd = dateEnd.getHours() * 60 + dateEnd.getMinutes();
            } else {
              xEnd = 1440;
            }

            switch (event.EventTypeCode.toUpperCase()) {
              case 'OFF':
              case 'PC':
                durationsOFF = durationsOFF + (xEnd - xBgn) * 60;
                break;

              case 'SB':
                durationsSB = durationsSB + (xEnd - xBgn) * 60;
                break;

              case 'D':
                durationsD = durationsD + (xEnd - xBgn) * 60;
                break;

              case 'ON':
              case 'YM':
                durationsON = durationsON + (xEnd - xBgn) * 60;
                break;
            }

            console.log('Duration OFF', durationsOFF);
            console.log('Duration SB', durationsSB);
            console.log('Duration D', durationsD);
            console.log('Duration ON', durationsON);
            console.log('hours worked', (durationsD + durationsON) / 60 / 60);
          }
        }
      });

      if (
        durationsBaseOFF != durationsOFF ||
        durationsBaseSB != durationsSB ||
        durationsBaseD != durationsD ||
        durationsBaseON != durationsON
      ) {
        this.logDailies[i].HoursOffDuty = durationsOFF;
        this.logDailies[i].HoursSleeper = durationsSB;
        this.logDailies[i].HoursDriving = durationsD;
        this.logDailies[i].HoursOnDuty = durationsON;
        this.logDailies[i].HoursWorked = durationsD + durationsON;

        this.dashboardService.updateLogDaily(this.logDailies[i]).subscribe(
          (response) => {
            console.log(
              'LogDaily (durationStatuses) is updated on server:',
              response
            );
          },
          async (error) => {
            console.log('Internet Status' + this.networkStatus);
            let tempEerror = {
              url: 'api/eldDashboard/UploadLogDailies',
              body: this.logDailies[i],
            };
            let offlineArray = await this.storage.get('offlineArray');
            offlineArray.push(tempEerror);
            await this.storage.set('offlineArray', offlineArray);
            console.log('Pushed in offlineArray');
          }
        );
      }

      // const foundLogHistory = this.logHistories.findIndex((logHistory) =>
      //   logHistory.DateBgn.includes(currentDay)
      // );

      // if (foundLogHistory !== -1) {
      //   logHistoriesForCurrencDay.push([foundLogHistory]);
      // }
    }
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
