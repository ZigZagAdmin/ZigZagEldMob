import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonModal, Platform } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription, firstValueFrom, forkJoin, interval } from 'rxjs';
import { NavController } from '@ionic/angular';
import { LogDailies } from 'src/app/models/log-dailies';
import { LogEvents } from 'src/app/models/log-histories';
import { Storage } from '@ionic/storage';
import { DashboardService } from 'src/app/services/dashboard.service';
import { InternetService } from 'src/app/services/internet.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from 'src/app/models/vehicle';
import { timeZones } from 'src/app/models/timeZone';
import { LocationService } from 'src/app/services/location.service';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ShareService } from 'src/app/services/share.service';
import { Capacitor } from '@capacitor/core';
import { Location } from 'src/app/models/dvirs';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-hos',
  templateUrl: './hos.page.html',
  styleUrls: ['./hos.page.scss'],
})
export class HosPage implements OnInit, OnDestroy {
  message = '';
  someErrors: boolean = false;
  bReady: boolean = false;
  databaseSubscription: Subscription | undefined;
  logDailies: LogDailies[] = [];
  logEvents: LogEvents[] = [];
  countDays: LogDailies[] = [];
  eventLogDailies: { [key: string]: { timeOff: number; timeSleeper: number; timeDriving: number; timeOnDuty: number } } = {};


  selectedButton: string = '';
  progressBreak = 0;
  progressShift = 0;
  progressCycle = 0;

  isModalOpen: boolean;
  modalLoading: boolean = false;
  isConfirmButtonActive: boolean = true;
  vehicleId: string = '';
  driverId: string = '';
  driverName: string = '';
  companyId: string = '';
  pickedVehicle: string = '';
  timeZone: string = '';
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

  restBreak: number = 0;
  restShift: number = 0;
  restCycle: number = 0;

  currentStatus = { statusCode: '', statusName: '' };
  currentStatusTime = '';

  vehicle!: Vehicle;
  locationDescription = '';
  location: Location = {
    locationType: '',
    description: '',
    latitude: 0,
    longitude: 0,
  };
  comments = '';
  restMode = false;

  locationStatus: boolean = false;
  locationServiceState: boolean = false;
  locationLoading: boolean = false;
  locationDisable: boolean = false;

  bluetoothStatus: boolean = false;

  lastSelectedButton: string = '';

  validation: { [key: string]: boolean } = {
    location: false,
  };

  animateCircles: boolean = true;

  internetSub: Subscription;
  networkStatus: boolean = true;

  bannerInfo: { show: boolean; type: 'success' | 'warning' | 'default' | 'error'; title: string; subtitle: string } = {
    show: false,
    type: 'default',
    title: '',
    subtitle: '',
  };

  hoursRecap: number = 0;

  last7hours: number = 0;
  recapData: any[] = [];
  todayWorkTime: any;
  cycle8Time: any = 0;
  availableToday: number = 0;
  availableTomorrow: number = 0;
  restartFlag = false;
  recapLoading: boolean = false;
  bResetTimeLast7Day: boolean = false;
  timeZones: { [key: string]: string } = {};

  pageLoading: boolean = false;

  newShift = 36000000; // 10 часов
  driveLimit = 39540000 + 60000; // 11 часов
  shiftLimit = 50400000; // 14 часов
  cycleLimit = 252000000; // 70 часов
  driveWithoutBreakLimit = 28800000; // 8 часов
  restartTime = 122400000; // 34 часа
  notDriveLimit = 30 * 60 * 1000; // 30min
  inspectionTime = 691200000; // 8 дней
  splitSleepData: { duration: number; drivingT: number; time: number };
  splitSleeperBerth: boolean = false;
  violations: any = {};
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private dashboardService: DashboardService,
    private internetService: InternetService,
    private storage: Storage,
    private storageService: DatabaseService,
    private locationService: LocationService,
    private bluetoothService: BluetoothService,
    private toastService: ToastService,
    private utilityService: UtilityService,
    private shareService: ShareService,
    private changeDetectorRef: ChangeDetectorRef,
    private platform: Platform,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    this.pageLoading = true;
    this.timeZones = this.utilityService.checkSeason();
    if (Capacitor.getPlatform() !== 'web') {
      await this.getLocationState();
      await this.getBluetoothState();
      this.platform.resume.subscribe(() => {
        this.ngZone.run(async () => {
          await this.getLocationState();
          await this.getBluetoothState();
        });
      });
      this.locationService.getLocationStatusObservable().subscribe(async (status: boolean) => {
        this.locationServiceState = status;
        await this.getLocationState();
      });
      this.bluetoothService.getBluetoothStatusObservable().subscribe(async (status: boolean) => {
        await this.getBluetoothState();
        await this.bluetoothService.getBluetoothAuthorizationStatus();
      });
    }

    this.internetSub = this.internetService.interetStatusObs.subscribe(async state => {
      this.networkStatus = state;
      console.log('HoS network: ', state);
      if (!state) {
        this.bannerInfo = {
          show: true,
          title: 'Offline Mode',
          subtitle: 'Check your internet connection.',
          type: 'warning',
        };
        this.changeDetectorRef.detectChanges();
      } else {
        this.bannerInfo.show = false;
        this.changeDetectorRef.detectChanges();
      }
      if (state) {
        this.logEvents = await firstValueFrom(this.databaseService.getLogEvents());
        this.logDailies = await firstValueFrom(this.databaseService.getLogDailies());
      }
    });

    this.updateEveryMinute();

    setTimeout(() => (this.animateCircles = false), 500); // It's ugly, but it works
  }

  ngOnDestroy(): void {
    this.shareService.destroyMessage();
  }

  async ionViewWillEnter() {
    this.getVehicle();
    this.vehicleId = await this.storage.get('vehicleId');
    this.driverId = await this.storage.get('driverId');
    this.companyId = await this.storage.get('companyId');
    this.timeZone = await this.storage.get('timeZone');
    this.bAuthorized = await this.storage.get('bAuthorized');
    this.driverName = await this.storage.get('name');
    this.pickedVehicle = await this.storage.get('vehicleUnit');
    this.databaseSubscription = this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
      if (ready) {
        this.bReady = ready;

        const logDailies$ = this.databaseService.getLogDailies();
        const logEvents$ = this.databaseService.getLogEvents();

        forkJoin([logDailies$, logEvents$]).subscribe(async ([logDailies, logEvents]) => {
          this.logDailies = logDailies;
          this.logEvents = logEvents;
          const filteredLogEvents = this.logEvents.filter(item => ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'].includes(item.type.code));
          this.selectedButton = filteredLogEvents[filteredLogEvents.length - 1].type.code;
          this.lastSelectedButton = filteredLogEvents[filteredLogEvents.length - 1].type.code;

          if (this.bAuthorized === false) {
            const lastLogEvent = this.logEvents[this.logEvents.length - 1];

            lastLogEvent.eventTime.logDate = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en_US', timeZones[this.timeZone as keyof typeof timeZones]);

            let LoginLogEvent: LogEvents = {
              logEventId: this.utilityService.uuidv4(),
              companyId: lastLogEvent.companyId,
              driverId: this.driverId,
              eventTime: {
                logDate: formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en_US', timeZones[this.timeZone as keyof typeof timeZones]),
                timeStamp: new Date().getTime(),
                timeStampEnd: new Date().getTime(),
                timeZone: this.timeZone,
              },
              vehicle: {
                vehicleId: this.vehicleId,
              },
              eld: {
                eldId: '00000000-0000-0000-0000-000000000000',
                macAddress: '',
                serialNumber: '',
              },
              location: {
                locationType: 'AUTOMATIC',
                description: '2mi from Chisinau, Chisinau',
                latitude: 0,
                longitude: 0,
              },
              sequenceNumber: lastLogEvent ? lastLogEvent.sequenceNumber + 1 : 1,
              type: { name: 'Login', code: 'LOGIN' },
              recordStatus: { name: 'Active', code: 'ACTIVE' },
              recordOrigin: { name: 'Driver', code: 'DRIVER' },
              odometer: 0,
              engineHours: 0,
              malfunction: false,
              dataDiagnosticEvent: false,
              certificationDate: lastLogEvent.certificationDate,
              comment: '',
              eventDataCheck: '',
              inspection: false,

              sent: true,
            };

            this.storage.set('lastStatusCode', this.selectedButton);
            this.storage.set('bAuthorized', true);

            if (this.networkStatus) {
              await this.dashboardService
                .updateLogEvent(lastLogEvent)
                .toPromise()
                .then(async response => {
                  console.log('Last LogEvent is updated on server:', response);
                  await this.updateIndexLogEvents(lastLogEvent, true);
                })
                .catch(async error => {
                  console.log('Internet Status: ' + this.networkStatus);
                  console.log('Last LogEvent Pushed in offline logEvents array');
                  await this.updateIndexLogEvents(lastLogEvent, false);
                });
              await this.dashboardService
                .updateLogEvent(LoginLogEvent)
                .toPromise()
                .then(async response => {
                  console.log('New status is updated on server:', response);
                  await this.updateLogEvents(LoginLogEvent, true);
                })
                .catch(async error => {
                  console.log('Internet Status: ' + this.networkStatus);
                  console.log('New Log Event Status Pushed in offline logEvents Array');
                  await this.updateLogEvents(LoginLogEvent, false);
                });
            } else {
              console.log('Updated logEvents in offline array');
              await this.updateIndexLogEvents(lastLogEvent, false);
              await this.updateLogEvents(LoginLogEvent, false);
            }
          }

          await this.createLogDailies();
          this.calcViolations();
          await this.calcRecap();
          this.pageLoading = false;
        });
      }
    });
    this.paramsSubscription = this.route.params.subscribe(params => {
      if (this.bReady) {
        this.databaseSubscription = this.databaseService.getLogDailies().subscribe(logDailies => {
          if (logDailies.length !== 0) this.logDailies = logDailies;
        });
      }
    });
  }

  async updateLogEvents(logEventData: LogEvents, online: boolean) {
    logEventData.sent = online;
    this.logEvents.push(logEventData);
    await this.storage.set('logEvents', this.logEvents);
  }

  async getLocationState() {
    await this.locationService.isLocationAvailable().then(async (state: boolean) => {
      if (state !== undefined && state !== null) {
        this.locationStatus = state;
        await this.storage.set('locationStatus', this.locationStatus);
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  async getBluetoothState() {
    let authorization = (await this.bluetoothService.getBluetoothAuthorizationStatus()).status;
    this.bluetoothStatus = (await this.bluetoothService.getBluetoothState()) && authorization;
    this.changeDetectorRef.detectChanges();
  }

  async updateIndexLogEvents(logEventData: LogEvents, online: boolean) {
    logEventData.sent = online;
    const index = this.logEvents.findIndex(item => item.logEventId === logEventData.logEventId);
    if (index !== -1) {
      this.logEvents[index] = logEventData;
    }
    await this.storage.set('logEvents', this.logEvents);
  }

  getVehicle() {
    this.storageService.getVehicles().subscribe(
      res => {
        this.vehicle = res[0];
      },
      error => console.log(error)
    );
  }

  switchMode() {
    this.restMode = !this.restMode;
  }

  async checkLocation() {
    if (!(await this.locationService.isLocationServiceAvailable())) {
      if (Capacitor.getPlatform() === 'android') {
        await this.locationService.goToLocationServiceSettings();
      } else {
        alert('Go to Settings -> Location Services to enable the location service.');
      }
      return;
    }
    await this.locationService.requestPermission();
  }

  async checkBluetooth() {
    if (!(await this.bluetoothService.getBluetoothState())) {
      let confirmation = confirm('Bluetooth service is turned off.\nProceed to settings?');
      if (confirmation) {
        if (Capacitor.getPlatform() === 'android') {
          await this.bluetoothService.goToBluetoothServiceSettings();
        } else {
          alert('Go to Settings -> Bluetooth in order to enable the bluetooth service.');
        }
      } else {
        alert('In order to connect to a device, you have to turn on the bluetooth service');
        return;
      }
    }
    await this.bluetoothService.requestBluetoothPermission();
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

  calcViolations() {
    console.log('calc violations');
    this.bResetTimeLast7Day = false;
    const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];
    this.violations = {};
    let breakT = 0;
    let driveT = 0;
    let driveT2 = 0;
    let shiftT = 0;
    let cycleT = 0;
    let firstEvent: LogEvents;
    let secondEvent: LogEvents;

    let timeNotDrive = 0;

    this.splitSleepData = undefined;

    let localLogEvents: LogEvents[] = JSON.parse(JSON.stringify(this.logEvents));
    // this.logDailies.forEach(
    //   logDaily => (localLogDailies[logDaily.logDate] = { timeOff: logDaily.timeOffDuty, timeSleeper: logDaily.timeSleeper, timeDriving: logDaily.timeDriving, timeOnDuty: logDaily.timeOnDuty })
    // );
    console.log(this.eventLogDailies);
    let time = 0;
    localLogEvents.forEach((event, index) => {
      if (event.recordStatus?.code === 'ACTIVE') {
        if (allSt.includes(event.type?.code)) {
          firstEvent = JSON.parse(JSON.stringify(event));
          secondEvent = JSON.parse(JSON.stringify(event));
          secondEvent.eventTime.timeStamp = !event.eventTime.timeStampEnd ? new Date().getTime() : JSON.parse(JSON.stringify(event.eventTime.timeStampEnd));
          time = secondEvent.eventTime.timeStamp - firstEvent.eventTime.timeStamp;

          if (this.logEvents.length === 0) this.currentStatus = { statusCode: 'OFF', statusName: 'Off Duty' };
          else {
            this.currentStatus.statusCode = event.type.code;
            this.currentStatus.statusName = event.type.name;
          }
          this.currentStatusTime = this.convertSecondToHours(time / 1000);

          switch (firstEvent.type.code) {
            case 'OFF':
            case 'SB':
            case 'PC':
              breakT += time;
              shiftT += time;
              timeNotDrive += time;

              if (this.splitSleeperBerth) {
                if ((firstEvent.type.code === 'SB' || firstEvent.type.code === 'OFF') && time >= 7200000 && time < this.newShift) {
                  let dur = Math.trunc(time / 1000 / 60 / 60);
                  let splitTime = 2;
                  if (dur >= 2 && dur < 3) {
                    splitTime = 2;
                  } else if (dur >= 3 && dur < 7) {
                    splitTime = 3;
                  } else if (dur >= 3 && dur < 8 && firstEvent.type.code === 'SB') {
                    splitTime = 7;
                  } else if (firstEvent.type.code === 'SB') {
                    splitTime = 8;
                  }

                  if ((splitTime >= 7 && firstEvent.type.code === 'SB') || (splitTime < 7 && dur < 7)) {
                    shiftT = shiftT - time;
                    let temp = {
                      duration: splitTime,
                      time: shiftT,
                      drivingT: driveT,
                    };

                    if (!this.splitSleepData && shiftT) {
                      this.splitSleepData = temp;
                    } else if (this.splitSleepData && shiftT) {
                      if (splitTime + this.splitSleepData.duration >= 10) {
                        shiftT -= this.splitSleepData.time;
                        driveT -= this.splitSleepData.drivingT;
                        this.splitSleepData = {
                          duration: splitTime,
                          time: shiftT,
                          drivingT: driveT,
                        };
                      }
                    }
                  }
                }
              }

              if (breakT >= this.newShift) {
                driveT = 0;
                shiftT = 0;
                this.splitSleepData = undefined;
              }
              if (breakT >= this.restartTime) {
                shiftT = 0;
                cycleT = 0;
                driveT = 0;
                this.splitSleepData = undefined;
                let timeLast7Days = new Date(this.logDailies[7].logDate).getTime();
                if (secondEvent.eventTime.timeStamp > timeLast7Days) {
                  this.bResetTimeLast7Day = true;
                }
              }
              break;
            case 'ON':
            case 'YM':
              breakT = 0;
              timeNotDrive += time;
              shiftT += time;
              cycleT += time;
              if (shiftT > this.shiftLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (shiftT - this.shiftLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  'Shift more than 14 hours',
                  secondEvent.eventTime.timeStamp - (shiftT - this.shiftLimit)
                );
                shiftT = 0;
              }
              if (cycleT > this.cycleLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (cycleT - this.cycleLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  'Cycle over 70 hours',
                  secondEvent.eventTime.timeStamp - (cycleT - this.cycleLimit)
                );
                cycleT = 0;
              }
              break;
            case 'D':
              breakT = 0;
              driveT2 += time;
              driveT += time;
              shiftT += time;
              cycleT += time;
              if (driveT2 > this.driveWithoutBreakLimit && timeNotDrive < this.notDriveLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (driveT2 - this.driveWithoutBreakLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  'Break violation',
                  secondEvent.eventTime.timeStamp - (driveT2 - this.driveWithoutBreakLimit)
                );
              }
              if (time > this.driveWithoutBreakLimit) {
                this.pushViolation(
                  formatDate(new Date(firstEvent.eventTime.timeStamp + this.driveWithoutBreakLimit), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  'Driving non-stop for more than 8 hours',
                  firstEvent.eventTime.timeStamp + this.driveWithoutBreakLimit
                );
              }
              if (driveT > this.driveLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (driveT - this.driveLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  'Driving Violation',
                  secondEvent.eventTime.timeStamp - (driveT - this.driveLimit)
                );
                driveT = 0;
              }
              if (shiftT > this.shiftLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (shiftT - this.shiftLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  'Shift more than 14 hours',
                  secondEvent.eventTime.timeStamp - (shiftT - this.shiftLimit)
                );
                shiftT = 0;
              }
              if (cycleT > this.cycleLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (cycleT - this.cycleLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  'Cycle over 70 hours',
                  secondEvent.eventTime.timeStamp - (cycleT - this.cycleLimit)
                );
                cycleT = 0;
              }
              timeNotDrive = 0;
              break;
          }
          if (timeNotDrive >= this.notDriveLimit) {
            timeNotDrive = 0;
            driveT2 = 0;
          }
          // let durationResult = this.calculateEventDuration(firstEvent);
          // switch (event.type.code.toUpperCase()) {
          //   case 'OFF':
          //   case 'PC':
          //     console.log(localLogDailies[firstEvent.eventTime.logDate]);
          //     console.log(firstEvent.eventTime.logDate);
          //     if (typeof durationResult === 'number') {
          //       localLogDailies[firstEvent.eventTime.logDate].timeOff += durationResult;
          //     } else {
          //       localLogDailies[firstEvent.eventTime.logDate].timeOff += durationResult[firstEvent.eventTime.logDate];
          //       let nextDate = formatDate(!firstEvent.eventTime.timeStampEnd ? new Date().getTime() : firstEvent.eventTime.timeStampEnd, 'yyyy/MM/dd', 'en_US', this.timeZones[this.timeZone]);
          //       localLogDailies[nextDate].timeOff += durationResult[nextDate];
          //     }
          //     break;

          //   case 'SB':
          //     if (typeof durationResult === 'number') {
          //       localLogDailies[firstEvent.eventTime.logDate].timeSleeper += durationResult;
          //     } else {
          //       localLogDailies[firstEvent.eventTime.logDate].timeSleeper += durationResult[firstEvent.eventTime.logDate];
          //       let nextDate = formatDate(!firstEvent.eventTime.timeStampEnd ? new Date().getTime() : firstEvent.eventTime.timeStampEnd, 'yyyy/MM/dd', 'en_US', this.timeZones[this.timeZone]);
          //       localLogDailies[nextDate].timeSleeper += durationResult[nextDate];
          //     }
          //     break;

          //   case 'D':
          //     if (typeof durationResult === 'number') {
          //       localLogDailies[firstEvent.eventTime.logDate].timeDriving += durationResult;
          //     } else {
          //       localLogDailies[firstEvent.eventTime.logDate].timeDriving += durationResult[firstEvent.eventTime.logDate];
          //       let nextDate = formatDate(!firstEvent.eventTime.timeStampEnd ? new Date().getTime() : firstEvent.eventTime.timeStampEnd, 'yyyy/MM/dd', 'en_US', this.timeZones[this.timeZone]);
          //       localLogDailies[nextDate].timeDriving += durationResult[nextDate];
          //     }
          //     break;

          //   case 'ON':
          //   case 'YM':
          //     if (typeof durationResult === 'number') {
          //       localLogDailies[firstEvent.eventTime.logDate].timeOnDuty += durationResult;
          //     } else {
          //       localLogDailies[firstEvent.eventTime.logDate].timeOnDuty += durationResult[firstEvent.eventTime.logDate];
          //       let nextDate = formatDate(!firstEvent.eventTime.timeStampEnd ? new Date().getTime() : firstEvent.eventTime.timeStampEnd, 'yyyy/MM/dd', 'en_US', this.timeZones[this.timeZone]);
          //       localLogDailies[nextDate].timeOnDuty += durationResult[nextDate];
          //     }
          //     break;
          // }
        }
      }
    });

    console.log('localLogDailies: ', this.eventLogDailies);

    this.titleBreak = (this.driveWithoutBreakLimit - driveT2) / 1000 < 0 ? 0 : (this.driveWithoutBreakLimit - driveT2) / 1000;
    this.titleCycle = (this.cycleLimit - cycleT) / 1000 < 0 ? 0 : (this.cycleLimit - cycleT) / 1000;
    this.titleDriving = (this.driveLimit - driveT) / 1000 < 0 ? 0 : (this.driveLimit - driveT) / 1000;
    this.titleShift = (this.shiftLimit - shiftT) / 1000 < 0 ? 0 : (this.shiftLimit - shiftT) / 1000;

    this.percentBreak = (this.titleBreak * 100) / (this.driveWithoutBreakLimit / 1000);
    this.percentCycle = (this.titleCycle * 100) / (this.cycleLimit / 1000);
    this.percentDriving = (this.titleDriving * 100) / (this.driveLimit / 1000);
    this.percentShift = (this.titleShift * 100) / (this.shiftLimit / 1000);

    this.hoursRecap = this.bResetTimeLast7Day ? (this.cycleLimit - cycleT) / 1000 : (this.cycleLimit - cycleT) / 1000 + this.logDailies[7].timeWorked;

    switch (this.currentStatus.statusCode) {
      case 'D':
        this.restBreak = 30 * 60;
        this.restShift = 10 * 60 * 60;
        this.restCycle = 34 * 60 * 60;
        break;
      case 'ON':
      case 'YM':
        this.restBreak = this.notDriveLimit - time < 0 ? 0 : (this.notDriveLimit - time) / 1000;
        this.restShift = 10 * 60 * 60;
        this.restCycle = 34 * 60 * 60;
        break;
      case 'OFF':
      case 'PC':
      case 'SB':
        this.restBreak = this.notDriveLimit - time < 0 ? 0 : (this.notDriveLimit - time) / 1000;
        this.restShift = this.newShift - time < 0 ? 0 : (this.newShift - time) / 1000;
        this.restCycle = this.restartTime - time < 0 ? 0 : (this.restartTime - time) / 1000;
        break;
    }
    this.progressBreak = (100 * this.restBreak) / (30 * 60) / 100;
    this.progressShift = (100 * this.restShift) / (10 * 60 * 60) / 100;
    this.progressCycle = (100 * this.restCycle) / (34 * 60 * 60) / 100;
    console.log(this.violations);

    // this.logDailies.forEach(el => {
    //   el.violations = this.violations[el.logDate] || [];
    // });
    // TODO: verify if violations changed before uploading to server
  }

  calculateEventDuration(event: LogEvents) {
    let start = new Date(formatDate(event.eventTime.timeStamp, 'yyyy/MM/dd', 'en_US', this.timeZones[this.timeZone]));
    let end = new Date(formatDate(!event.eventTime.timeStampEnd ? new Date().getTime() : event.eventTime.timeStampEnd, 'yyyy/MM/dd', 'en_US', this.timeZones[this.timeZone]));
    for(let currentDate = start; currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
      this.eventLogDailies[formatDate(event.eventTime.timeStamp, 'yyyy/MM/dd', 'en_US' )]
    }
    
  }

  pushViolation(day: string, name: string, date: number) {
    let local = {
      startTime: date,
      regulations: {
        code: name,
      },
    };
    if (this.violations[day]) {
      this.violations[day].push(local);
    } else {
      this.violations[day] = [local];
    }
  }

  async toggleModal() {
    this.isModalOpen = true;
    this.locationDescription = '';
    this.comments = '';

    if (this.currentStatus) {
      this.selectButton(this.currentStatus.statusCode);
    }
    await this.getLocalCurrentLocation();
  }

  async getLocalCurrentLocation() {
    this.locationLoading = true;
    if (Capacitor.getPlatform() !== 'web') {
      if (!this.locationStatus) {
        this.toastService.showToast('Problems fetching location! Check the location service!', 'danger', 2500);
      }
    }
    await this.locationService.getCurrentLocation().then(res => {
      this.location = res;
      this.locationDescription = this.location.description;
      this.locationLoading = false;
      if (this.location.locationType === 'AUTOMATIC') {
        this.locationDisable = true;
      } else {
        this.locationDisable = false;
      }
    });
  }

  selectLog(log: LogDailies) {
    this.navCtrl.navigateForward(['log-item', log.logDailyId]);
  }

  selectButton(button: string) {
    this.selectedButton = button;
    if (this.selectedButton === this.currentStatus.statusCode) {
      this.isConfirmButtonActive = false;
    } else {
      this.isConfirmButtonActive = true;
    }
  }

  cancel() {
    this.shareService.destroyMessage();
    this.selectedButton = this.lastSelectedButton;
    this.isModalOpen = false;
  }

  async confirm() {
    this.shareService.changeMessage(this.utilityService.generateString(5));
    if (!this.utilityService.validateForm(this.validation)) return;
    if (this.selectedButton && this.selectedButton !== this.lastSelectedButton) {
      this.lastSelectedButton = this.selectedButton;
      this.shareService.destroyMessage();
      await this.storage.set('lastStatusCode', this.selectedButton);
      await this.onWillDismiss().then(() => {
        this.isModalOpen = false;
        this.modalLoading = false;
      });
    } else {
      this.toastService.showToast('You need to select a different status!', 'warning');
    }
  }

  async onWillDismiss() {
    this.modalLoading = true;
    const endTime = new Date().getTime();
    const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];
    const filteredLogEvents = this.logEvents.filter(item => allSt.includes(item.type.code));
    let lastLogEvent = filteredLogEvents[filteredLogEvents.length - 1];

    if (lastLogEvent) {
      lastLogEvent.eventTime.timeStampEnd = endTime;
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

    let newLogEvent: LogEvents = {
      logEventId: this.utilityService.uuidv4(),
      companyId: lastLogEvent.companyId,
      driverId: this.driverId,
      eventTime: {
        logDate: formatDate(new Date(endTime), 'yyyy/MM/dd', 'en_US', timeZones[this.timeZone as keyof typeof timeZones]),
        timeStamp: endTime,
        timeZone: this.timeZone,
      },
      vehicle: {
        vehicleId: this.vehicleId,
      },
      eld: {
        eldId: '00000000-0000-0000-0000-000000000000',
        macAddress: '',
        serialNumber: '',
      },
      location: {
        locationType: this.location.locationType,
        description: this.locationDescription,
        latitude: this.location.latitude,
        longitude: this.location.longitude,
      },
      sequenceNumber: lastLogEvent ? lastLogEvent.sequenceNumber + 1 : 1,
      type: { name: statuses[this.selectedButton as keyof typeof statuses] ? statuses[this.selectedButton as keyof typeof statuses].statusName : 'Unknown', code: this.selectedButton },
      recordStatus: { name: 'Active', code: 'ACTIVE' },
      recordOrigin: { name: 'Driver', code: 'DRIVER' },
      odometer: 0,
      engineHours: 0,
      malfunction: false,
      dataDiagnosticEvent: false,
      certificationDate: lastLogEvent.certificationDate,
      comment: this.comments,
      eventDataCheck: '',
      inspection: false,

      sent: true,
    };

    if (this.networkStatus) {
      await this.dashboardService
        .updateLogEvent(lastLogEvent)
        .toPromise()
        .then(async response => {
          console.log('Last LogEvent is updated on server:', response);
          await this.updateIndexLogEvents(lastLogEvent, true);
        })
        .catch(async error => {
          console.log('Internet Status: ' + this.networkStatus);
          console.log('Last LogEvent Pushed in offline logEvents array');
          await this.updateIndexLogEvents(lastLogEvent, false);
        });
      await this.dashboardService
        .updateLogEvent(newLogEvent)
        .toPromise()
        .then(async response => {
          console.log('New status is updated on server:', response);
          await this.updateLogEvents(newLogEvent, true);
        })
        .catch(async error => {
          console.log('Internet Status: ' + this.networkStatus);
          console.log('New Log Event Status Pushed in offline logEvents Array');
          await this.updateLogEvents(newLogEvent, false);
        });
    } else {
      console.log('Updated logEvents in offline array');
      await this.updateIndexLogEvents(lastLogEvent, false);
      await this.updateLogEvents(newLogEvent, false);
    }

    await this.createLogDailies();
    this.calcViolations();
    await this.calcRecap();
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

    sHours = (Math.trunc((secs / (60 * 60 * 24)) % 24) * 24 + Math.trunc((secs / (60 * 60)) % 24)).toString();
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

  async toggleSplitSleeperBerth(value: boolean) {
    this.splitSleeperBerth = value;
    this.calcViolations();
    await this.calcRecap();
  }

  async createLogDailies() {
    let currentDate = new Date();
    this.countDays = [];
    this.logDailies = await firstValueFrom(this.databaseService.getLogDailies());
    for (let i = 0; i < 14; i++) {
      const dateString = currentDate.toISOString().split('T')[0].replace(/-/g, '/');
      const foundLogDayIndex = this.logDailies.findIndex(logDay => logDay.logDate.includes(dateString));

      if (foundLogDayIndex !== -1) {
        this.countDays.push(this.logDailies[foundLogDayIndex]);
      } else {
        let newLogDaily: LogDailies = {
          logDailyId: this.utilityService.uuidv4(),
          companyId: this.companyId,
          driverId: this.driverId,
          driverName: '',
          logDate: dateString.replace(/-/g, '/'),
          timeOffDuty: 0,
          timeSleeper: 0,
          timeDriving: 0,
          timeOnDuty: 0,
          timeWorked: 0,
          violations: [],
          formManner: false,
          certified: false,
          form: {
            trailers: '',
            shippingDoc: '',
            fromAddress: '',
            toAddress: '',
            signatureId: '00000000-0000-0000-0000-000000000000',
          },
        };

        this.countDays.push(newLogDaily);
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    this.countDays.sort((a, b) => b.logDate.localeCompare(a.logDate));

    this.logDailies = this.countDays.slice();

    await this.storage.set('logDailies', this.logDailies);
  }

  async updateLogDailies(logDaily: LogDailies) {
    if (this.networkStatus) {
      this.dashboardService.updateLogDaily(logDaily).subscribe(
        async response => {
          console.log('LogDaily (durationStatuses) is updated on server:', response);
          await this.updateIndexLogDaily(logDaily, true);
        },
        async error => {
          console.log('Internet Status: ' + this.networkStatus);
          await this.updateIndexLogDaily(logDaily, false);
          console.log('Pushed in logDailies');
        }
      );
    } else {
      console.log('Updated logEvents in offline array');
      await this.updateIndexLogDaily(logDaily, false);
    }
  }

  async calcRecap() {
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
    let LogEventsForCurrencDay = [];

    for (let i = 0; i < this.logDailies.length; i++) {
      let currentDay = this.logDailies[i].logDate;

      durationsOFF = 0;
      durationsSB = 0;
      durationsD = 0;
      durationsON = 0;

      durationsBaseOFF = this.logDailies[i].timeOffDuty;
      durationsBaseSB = this.logDailies[i].timeSleeper;
      durationsBaseD = this.logDailies[i].timeDriving;
      durationsBaseON = this.logDailies[i].timeOnDuty;

      this.logEvents.forEach(event => {
        if (allSt.includes(event.type.code)) {
          dateBgn = new Date(formatDate(new Date(event.eventTime.timeStamp), 'yyyy-MM-ddTHH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]));
          dateEnd = new Date(
            formatDate(
              new Date(event.eventTime?.timeStampEnd ? event.eventTime.timeStampEnd : new Date()),
              'yyyy-MM-ddTHH:mm:ss',
              'en_US',
              this.timeZones[this.timeZone as keyof typeof this.timeZones]
            )
          );

          if (
            formatDate(dateBgn, 'yyyy-MM-dd', 'en_US') <= formatDate(currentDay, 'yyyy-MM-dd', 'en_US') &&
            formatDate(currentDay, 'yyyy-MM-dd', 'en_US') <= formatDate(dateEnd, 'yyyy-MM-dd', 'en_US')
          ) {
            if (dateBgn.toLocaleDateString() === new Date(currentDay).toLocaleDateString()) {
              xBgn = dateBgn.getHours() * 60 * 60 + dateBgn.getMinutes() * 60 + dateBgn.getSeconds();
            } else {
              xBgn = 0;
            }

            if (dateEnd.toLocaleDateString() === new Date(currentDay).toLocaleDateString()) {
              xEnd = dateEnd.getHours() * 60 * 60 + dateEnd.getMinutes() * 60 + dateEnd.getSeconds();
            } else {
              xEnd = 1440 * 60;
            }
            switch (event.type.code.toUpperCase()) {
              case 'OFF':
              case 'PC':
                durationsOFF = durationsOFF + (xEnd - xBgn);
                break;

              case 'SB':
                durationsSB = durationsSB + (xEnd - xBgn);
                break;

              case 'D':
                durationsD = durationsD + (xEnd - xBgn);
                break;

              case 'ON':
              case 'YM':
                durationsON = durationsON + (xEnd - xBgn);
                break;
            }
          }
        }
      });

      if (durationsBaseOFF != durationsOFF || durationsBaseSB != durationsSB || durationsBaseD != durationsD || durationsBaseON != durationsON) {
        this.logDailies[i].timeOffDuty = durationsOFF;
        this.logDailies[i].timeSleeper = durationsSB;
        this.logDailies[i].timeDriving = durationsD;
        this.logDailies[i].timeOnDuty = durationsON;
        this.logDailies[i].timeWorked = durationsD + durationsON;
        await this.updateLogDailies(this.logDailies[i]);
      }
    }
  }

  async updateLogDaily(logDailyData: LogDailies, online: boolean) {
    logDailyData.sent = online;
    this.logDailies.push(logDailyData);
    await this.storage.set('logDailies', this.logDailies);
  }

  async updateIndexLogDaily(logDailyData: LogDailies, online: boolean) {
    logDailyData.sent = online;
    const index = this.logDailies.findIndex(item => item.logDailyId === logDailyData.logDailyId);
    if (index !== -1) {
      this.logDailies[index] = logDailyData;
    }
    await this.storage.set('logDailies', this.logDailies);
  }

  getStatusColor(status: string) {
    if (status) {
      let colorObj = {
        OFF: 'var(--gray-300)',
        SB: 'var(--gray-500)',
        ON: 'var(--warning-400)',
        D: 'var(--success-500)',
        PC: 'var(--gray-300)',
        YM: 'var(--warning-400)',
      };
      return colorObj[status as keyof typeof colorObj];
    }
    return 'var(--success-500)';
  }

  async uploadDriverStatus() {
    if (this.networkStatus) {
      let currentLocation;
      await this.locationService.getCurrentLocation().then(res => {
        if (res.locationType === 'MANUAL') {
          let lastLogEvent = this.logEvents
            .slice()
            .reverse()
            .findIndex(el => ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'].includes(el.type.code));
          currentLocation = this.logEvents.slice().reverse()[lastLogEvent].location;
        } else {
          currentLocation = res;
        }
      });
      await firstValueFrom(
        this.dashboardService.updateDriverStatuses({
          driverId: this.driverId,
          vehicleId: this.vehicleId,
          eventType: { code: this.currentStatus.statusCode },
          location: currentLocation,
          breakTime: {
            availableTime: parseInt(this.titleBreak.toPrecision()),
            limitTime: 0,
            accumulatedTime: 0,
          },
          driveTime: {
            availableTime: parseInt(this.titleDriving.toPrecision()),
            limitTime: 0,
            accumulatedTime: 0,
          },
          shiftTime: {
            availableTime: parseInt(this.titleShift.toPrecision()),
            limitTime: 0,
            accumulatedTime: 0,
          },
          cycleTime: {
            availableTime: parseInt(this.titleCycle.toPrecision()),
            limitTime: 0,
            accumulatedTime: 0,
          },
          lastEventDate: this.logEvents[this.logEvents.length - 1].eventTime.timeStamp,
          updateDate: new Date().getTime(),
        })
      );
    }
  }

  updateEveryMinute() {
    setInterval(async () => {
      console.log('Every Minute Update');
      await this.createLogDailies();
      await this.uploadDriverStatus();
      this.calcViolations();
      await this.calcRecap();
    }, 60000);
  }

  getTotalWorkedHours() {
    return this.logDailies.slice(1, 8).reduce((accumulator, currentValue) => {
      return accumulator + (currentValue.timeWorked === undefined || currentValue.timeWorked === null ? 0 : currentValue.timeWorked);
    }, 0);
  }

  async ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
  }
}
