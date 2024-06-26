import { AfterViewChecked, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
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
import { hosErrors } from 'src/app/utilities/hos-errors';
import { ELD } from 'src/app/models/eld';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { TranslateService } from '@ngx-translate/core';
import { CarSimulatorService } from 'src/app/services/car-simulator.service';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { App } from '@capacitor/app';

interface BannerInfo {
  show: boolean;
  type: 'success' | 'warning' | 'default' | 'error';
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-hos',
  templateUrl: './hos.page.html',
  styleUrls: ['./hos.page.scss'],
})
export class HosPage implements OnInit, OnDestroy, AfterViewChecked {
  message = '';
  someErrors: boolean = false;
  bReady: boolean = false;
  databaseSubscription: Subscription | undefined;
  logDailies: LogDailies[] = [];
  logEvents: LogEvents[] = [];
  countDays: LogDailies[] = [];
  eventLogDailies: { [key: string]: { timeOff: number; timeSleeper: number; timeDriving: number; timeOnDuty: number; timeWorked: number } } = {};

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
  currentDriving: { start: number; index: number } = { start: 0, index: 0 };
  currentStatusTime = '';
  currentStatusColor: string = '';

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

  bannerInfo: BannerInfo = {
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
  ionViewTrigger: boolean = false;

  locationSub: Subscription;
  bluetoothSub: Subscription;
  connectionSub: Subscription;
  platformSub: Subscription;

  deviceConStatus: boolean = false;
  eldData: { [key: string]: string } = {};
  eldDataSub: Subscription;
  lastEld: ELD;
  elds: ELD[] = [];
  isDrivingAuto: boolean = false;

  autoChangeLoading: boolean = false;
  lastSpeedValue: number = 0;
  slowDownTimeout: any;
  slowDownTimoutRemaining: number = 0;
  slowDownTimoutRemainingInterval: any;
  lastRPM: number = 0;
  lastEldData: { [key: string]: string } = {};

  skipFirst: boolean = false;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private dashboardService: DashboardService,
    private internetService: InternetService,
    private storage: Storage,
    private storageService: DatabaseService,
    private locationService: LocationService,
    private geolocationService: GeolocationService,
    private bluetoothService: BluetoothService,
    private toastService: ToastService,
    private utilityService: UtilityService,
    private shareService: ShareService,
    private changeDetectorRef: ChangeDetectorRef,
    private platform: Platform,
    private ngZone: NgZone,
    private translate: TranslateService,
    public carSim: CarSimulatorService
  ) {}

  async ngOnInit() {
    // this.carSim.startSimulation();
    this.pageLoading = true;
    this.ionViewTrigger = true;
    const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];
    this.timeZones = this.utilityService.checkSeason();
    if (Capacitor.getPlatform() !== 'web') {
      await this.getLocationState();
      await this.getBluetoothState();
      this.platformSub = this.platform.resume.subscribe(() => {
        this.ngZone.run(async () => {
          await this.getLocationState();
          await this.getBluetoothState();
        });
      });
      this.locationSub = this.locationService.getLocationStatusObservable().subscribe(async (status: boolean) => {
        this.locationServiceState = status;
        await this.getLocationState();
      });
      this.bluetoothSub = this.bluetoothService.getBluetoothStatusObservable().subscribe(async (status: boolean) => {
        await this.getBluetoothState();
        await this.bluetoothService.getBluetoothAuthorizationStatus();
      });
      this.connectionSub = this.bluetoothService.getDeviceConnectionStatusObservable().subscribe(async (status: boolean) => {
        this.deviceConStatus = status;
        await this.showBannerInfoMessage();
      });
      this.eldDataSub = this.bluetoothService.getBluetoothDataObservable().subscribe(async (data: { [key: string]: string }) => {
        console.log(data);
        if (data) {
          this.eldData = data;
          this.lastEldData = data;
          if (this.skipFirst) {
            this.changeDrivingAutomatically(); // removed await
            this.powerUpAndDown(); // removed await
          }
          this.skipFirst = true;
          this.lastRPM = parseInt(this.eldData['R']);
        }
      });
    }

    this.internetSub = this.internetService.interetStatusObs.subscribe(async state => {
      this.networkStatus = state;
      await this.showBannerInfoMessage();
      if (state) {
        this.logEvents = await firstValueFrom(this.databaseService.getLogEvents());
        this.logDailies = await firstValueFrom(this.databaseService.getLogDailies());
      }
    });
    this.paramsSubscription = this.route.params.subscribe(async () => {
      if (this.bReady) {
        await firstValueFrom(this.databaseService.getLogDailies()).then(async logDailies => {
          if (!this.ionViewTrigger) {
            console.log('HOS PAGE PARAM SUBS');
            // this.pageLoading = true; // to be changed
            if (logDailies.length !== 0) this.logDailies = logDailies;
            await firstValueFrom(this.databaseService.getLogEvents()).then(res => (res.length !== 0 ? (this.logEvents = res) : null));
            let localCurrentStatus = JSON.parse(JSON.stringify(this.logEvents))
              .reverse()
              .find((el: LogEvents) => allSt.includes(el.type.code))?.type?.code;
            await this.storage.set('lastStatusCode', localCurrentStatus);
            this.currentStatus.statusCode = localCurrentStatus;
            this.selectedButton = localCurrentStatus;
            this.lastSelectedButton = localCurrentStatus;
            await this.createLogDailies();
            await this.calcViolations();
            // this.pageLoading = false; // to be changed
          }
        });
      }
    });

    this.updateEveryMinute();

    setTimeout(() => (this.animateCircles = false), 2000); // It's ugly, but it works
  }

  ngAfterViewChecked(): void {
    // this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.shareService.destroyMessage();
    if (this.internetSub) this.internetSub.unsubscribe();
    if (this.locationSub) this.locationSub.unsubscribe();
    if (this.bluetoothSub) this.bluetoothSub.unsubscribe();
    if (this.eldDataSub) this.eldDataSub.unsubscribe();
  }

  async ionViewWillEnter() {
    this.ionViewTrigger = true;
    this.getVehicle();
    this.vehicleId = await this.storage.get('vehicleId');
    this.driverId = await this.storage.get('driverId');
    this.companyId = await this.storage.get('companyId');
    this.timeZone = await this.storage.get('timeZone');
    this.bAuthorized = await this.storage.get('bAuthorized');
    this.driverName = await this.storage.get('name');
    this.pickedVehicle = await this.storage.get('vehicleUnit');
    let localSplitSleep = await this.storage.get('splitSleeperBerth');
    let chosenEldMac = await this.storage.get('lastConnectedELD');
    await this.handleSplitSleep(localSplitSleep);
    this.databaseSubscription = this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
      if (ready) {
        this.bReady = ready;

        const logDailies$ = this.databaseService.getLogDailies();
        const logEvents$ = this.databaseService.getLogEvents();
        const company$ = this.databaseService.getCompany();
        const elds$ = this.databaseService.getELDs();

        forkJoin([logDailies$, logEvents$, elds$, company$]).subscribe(async ([logDailies, logEvents, elds, company]) => {
          this.logDailies = logDailies;
          this.logEvents = logEvents;
          const filteredLogEvents = this.logEvents.filter(item => ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'].includes(item.type.code));
          let temp = new Date().setDate(new Date().getDate() - 14);
          let day = formatDate(new Date(temp), 'yyyy/MM/dd', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]);
          let timeZoneDifference =
            new Date(formatDate(new Date(`${day} 00:00:00`), 'yyyy/MM/dd hh:mm:ss a', 'en_US')).getTime() -
            new Date(formatDate(new Date(`${day} 00:00:00`), 'yyyy/MM/dd hh:mm:ss a', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones])).getTime();
          this.elds = elds;
          this.lastEld = chosenEldMac !== null && chosenEldMac !== undefined && chosenEldMac.length !== 0 ? this.elds.find(el => el.macAddress === chosenEldMac) : undefined;
          if (filteredLogEvents.length === 0) {
            let firstLogEvent: LogEvents = {
              logEventId: this.utilityService.uuidv4(),
              companyId: company.companyId,
              driverId: this.driverId,
              eventTime: {
                logDate: formatDate(new Date(temp), 'yyyy/MM/dd', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]),
                timeStamp: new Date(formatDate(new Date(`${day} 00:00:00`), 'yyyy/MM/dd hh:mm:ss a', 'en_US')).getTime() + timeZoneDifference,
                timeZone: this.timeZone,
              },
              vehicle: {
                vehicleId: this.vehicleId,
              },
              eld: {
                eldId: this.lastEld ? this.lastEld.eldId : '00000000-0000-0000-0000-000000000000',
                macAddress: this.lastEld ? this.lastEld.macAddress : '',
                serialNumber: this.lastEld ? this.lastEld.fwVersion : '',
              },
              sequenceNumber: 1,
              type: { name: 'Off Duty', code: 'OFF' },
              recordStatus: { name: 'Active', code: 'ACTIVE' },
              recordOrigin: { name: 'Driver', code: 'DRIVER' },
              malfunction: false,
              dataDiagnosticEvent: false,
              comment: '',
              eventDataCheck: '',
              inspection: false,
              sent: true,
            };
            this.selectedButton = 'OFF';
            this.lastSelectedButton = 'OFF';
            this.currentStatus.statusCode = 'OFF';
            this.currentStatus.statusName = 'Off Duty';
            this.currentStatusColor = this.getStatusColor(this.currentStatus.statusCode);

            if (this.networkStatus) {
              await this.dashboardService
                .updateLogEvent(firstLogEvent)
                .toPromise()
                .then(async response => {
                  console.log('New status is updated on server:', response);
                  await this.updateLogEvents(firstLogEvent, true);
                })
                .catch(async error => {
                  console.log('Internet Status: ' + this.networkStatus);
                  console.log('New Log Event Status Pushed in offline logEvents Array');
                  await this.updateLogEvents(firstLogEvent, false);
                });
            } else {
              console.log('Updated logEvents in offline array');
              await this.updateLogEvents(firstLogEvent, false);
            }
          } else {
            this.selectedButton = filteredLogEvents[filteredLogEvents.length - 1].type.code;
            this.lastSelectedButton = filteredLogEvents[filteredLogEvents.length - 1].type.code;
          }

          if (this.bAuthorized === false) {
            const lastLogEvent = this.logEvents[this.logEvents.length - 1];

            // lastLogEvent.eventTime.logDate = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en_US', timeZones[this.timeZone as keyof typeof timeZones]);

            let LoginLogEvent: LogEvents = {
              logEventId: this.utilityService.uuidv4(),
              companyId: lastLogEvent.companyId,
              driverId: this.driverId,
              eventTime: {
                logDate: formatDate(new Date(), 'yyyy/MM/dd', 'en_US', timeZones[this.timeZone as keyof typeof timeZones]),
                timeStamp: new Date().getTime(),
                timeStampEnd: new Date().getTime(),
                timeZone: this.timeZone,
              },
              vehicle: {
                vehicleId: this.vehicleId,
              },
              eld: {
                eldId: this.lastEld ? this.lastEld.eldId : '00000000-0000-0000-0000-000000000000',
                macAddress: this.lastEld ? this.lastEld.macAddress : '',
                serialNumber: this.lastEld ? this.lastEld.fwVersion : '',
              },
              location: {
                locationType: '',
                description: '',
                latitude: 0,
                longitude: 0,
              },
              sequenceNumber: lastLogEvent ? lastLogEvent.sequenceNumber + 1 : 1,
              type: { name: 'Login', code: 'LOGIN' },
              recordStatus: { name: 'Active', code: 'ACTIVE' },
              recordOrigin: { name: 'Driver', code: 'DRIVER' },
              odometer: this.eldData['O'] ? parseInt(this.eldData['O']) : 1,
              engineHours: this.eldData['H'] ? parseInt(this.eldData['H']) : 1,
              malfunction: false,
              dataDiagnosticEvent: false,
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
                .catch(async () => {
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
                .catch(async () => {
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
          await this.calcViolations();
          this.pageLoading = false;
          this.ionViewTrigger = false;
        });
      }
    });
  }

  async handleSplitSleep(value: boolean | undefined | null) {
    if (value === null || value === undefined) {
      this.splitSleeperBerth = false;
    } else {
      this.splitSleeperBerth = value;
    }
    await this.storage.set('splitSleeperBerth', this.splitSleeperBerth);
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
    let serviceState = await this.bluetoothService.getBluetoothState();
    this.bluetoothStatus = serviceState && authorization;
    await this.showBannerInfoMessage();
    console.log('bluetoothStatus: ', authorization);
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
      let state = confirm(this.translate.instant('Looks like the location service is turned off.\nProceed to settings?'));
      if (state) {
        await this.openLocationSettingsAndAwaitReturn();
        return;
      }
    }
    console.log('SOMETHING: ', (await this.locationService.isLocationPermissionGranted()).value.toLocaleUpperCase());
    await this.platform.ready().then(async res => {
      if (
        Capacitor.getPlatform() === 'android' ||
        (Capacitor.getPlatform() === 'ios' &&
          ((await this.locationService.isLocationPermissionGranted()).value.toLocaleUpperCase() === 'NOT_REQUESTED' ||
            (await this.locationService.isLocationPermissionGranted()).value.toLocaleUpperCase() === 'NOT_DETERMINED'))
      ) {
        await this.locationService.requestPermission('no');
      } else if ((await this.locationService.isLocationPermissionGranted()).value.toLocaleUpperCase() === 'DENIED_ALWAYS') {
        let state = confirm(this.translate.instant('You need to give access to your location.\nProceed to settings?'));
        if (state) {
          await NativeSettings.open({
            optionAndroid: AndroidSettings.ApplicationDetails,
            optionIOS: IOSSettings.App,
          });
        }
      }
    });
  }

  async openLocationSettingsAndAwaitReturn() {
    await NativeSettings.open({
      optionAndroid: AndroidSettings.Location,
      optionIOS: IOSSettings.LocationServices,
    });

    await new Promise<void>(resolve => {
      App.addListener('appStateChange', state => {
        if (state.isActive) {
          resolve();
        }
      });
    });
  }

  async checkBluetooth() {
    if (Capacitor.getPlatform() !== 'web') {
      if (
        (await this.bluetoothService.getBluetoothAuthorizationStatus()).value.toUpperCase() === 'DENIED_ALWAYS' ||
        (await this.bluetoothService.getBluetoothAuthorizationStatus()).value.toUpperCase() === 'DENIED_ONCE'
      ) {
        let confirmation = confirm(this.translate.instant('Bluetooth permission is required for connection to eld.\nProceed to settings?'));
        if (confirmation) {
          await this.openSettingsAndAwaitReturn();
          return;
        } else {
          alert(this.translate.instant('In order to connect to a device, you to give bluetooth permission!'));
          return;
        }
      } else if ((await this.bluetoothService.getBluetoothAuthorizationStatus()).value.toUpperCase() === 'NOT_REQUESTED') {
        try {
          await this.bluetoothService.requestBluetoothPermission();
        } catch (e) {
          console.error(e);
          return;
        }
      }
      if (!(await this.bluetoothService.getBluetoothState())) {
        let confirmation = confirm(this.translate.instant('Bluetooth service has to be turned on to connect to eld.\nProceed to settings?'));
        if (confirmation) {
          await this.openServiceSettingsAndAwaitReturn();
          return;
        } else {
          alert(this.translate.instant('In order to connect to a device, you to give bluetooth permission!'));
          return;
        }
      }
    }
    if (!this.deviceConStatus && this.bluetoothStatus) {
      this.goToConnectPage();
    }
  }

  async openServiceSettingsAndAwaitReturn() {
    await NativeSettings.open({
      optionAndroid: AndroidSettings.Bluetooth,
      optionIOS: IOSSettings.Bluetooth,
    });

    await new Promise<void>(resolve => {
      App.addListener('appStateChange', state => {
        if (state.isActive) {
          resolve();
        }
      });
    });
  }

  async openSettingsAndAwaitReturn() {
    await NativeSettings.open({
      optionAndroid: AndroidSettings.ApplicationDetails,
      optionIOS: IOSSettings.App,
    });

    await new Promise<void>(resolve => {
      App.addListener('appStateChange', state => {
        if (state.isActive) {
          resolve();
        }
      });
    });
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

  async calcViolations() {
    this.eventLogDailies = {};
    this.bResetTimeLast7Day = false;
    const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];
    this.violations = {};
    let breakT = 0;
    let driveT = 0;
    let driveT2 = 0;
    let shiftT = 0;
    let shiftT2 = 0;
    let cycleT = 0;
    let firstEvent: LogEvents;
    let secondEvent: LogEvents;

    let timeNotDrive = 0;

    this.splitSleepData = undefined;

    let localLogEvents: LogEvents[] = JSON.parse(JSON.stringify(this.logEvents));

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
            this.currentStatusColor = this.getStatusColor(this.currentStatus.statusCode);
          }
          this.currentStatusTime = this.convertSecondToHours(time / 1000);

          switch (firstEvent.type.code) {
            case 'OFF':
            case 'SB':
            case 'PC':
              breakT += time;
              shiftT += time;
              shiftT2 += time;
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
                    shiftT2 = shiftT2 - time;
                    shiftT -= time;
                    let temp = {
                      duration: splitTime,
                      time: shiftT2,
                      drivingT: driveT,
                    };

                    if (!this.splitSleepData && shiftT2) {
                      this.splitSleepData = temp;
                    } else if (this.splitSleepData && shiftT2) {
                      if (splitTime + this.splitSleepData.duration >= 10) {
                        shiftT2 -= this.splitSleepData.time;
                        shiftT -= this.splitSleepData.time;
                        driveT -= this.splitSleepData.drivingT;
                        this.splitSleepData = {
                          duration: splitTime,
                          time: shiftT2,
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
                shiftT2 = 0;
                this.splitSleepData = undefined;
              }
              if (breakT >= this.restartTime) {
                shiftT = 0;
                shiftT2 = 0;
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
              shiftT2 += time;
              cycleT += time;
              if (shiftT2 > this.shiftLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (shiftT2 - this.shiftLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  hosErrors.DUTY_LIMIT,
                  secondEvent.eventTime.timeStamp - (shiftT2 - this.shiftLimit)
                );
                shiftT2 = 0;
                // shiftT = 0;
              }
              if (cycleT > this.cycleLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (cycleT - this.cycleLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  hosErrors.US_70_8,
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
              shiftT2 += time;
              cycleT += time;
              if (driveT2 > this.driveWithoutBreakLimit && timeNotDrive < this.notDriveLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (driveT2 - this.driveWithoutBreakLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  hosErrors.REST_BREAK,
                  secondEvent.eventTime.timeStamp - (driveT2 - this.driveWithoutBreakLimit)
                );
                driveT2 = 0;
              }
              // if (time > this.driveWithoutBreakLimit) {
              //   this.pushViolation(
              //     formatDate(new Date(firstEvent.eventTime.timeStamp + this.driveWithoutBreakLimit), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
              //     'Driving non-stop for more than 8 hours',
              //     firstEvent.eventTime.timeStamp + this.driveWithoutBreakLimit
              //   );
              // }
              if (driveT > this.driveLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (driveT - this.driveLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  hosErrors.DRIVING,
                  secondEvent.eventTime.timeStamp - (driveT - this.driveLimit)
                );
                driveT = 0;
              }
              if (shiftT2 > this.shiftLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (shiftT2 - this.shiftLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  hosErrors.DUTY_LIMIT,
                  secondEvent.eventTime.timeStamp - (shiftT2 - this.shiftLimit)
                );
                shiftT2 = 0;
                // shiftT = 0;
              }
              if (cycleT > this.cycleLimit) {
                this.pushViolation(
                  formatDate(new Date(secondEvent.eventTime.timeStamp - (cycleT - this.cycleLimit)), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]),
                  hosErrors.US_70_8,
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

          /** CALCULATE RECAP */

          if (!this.eventLogDailies[firstEvent.eventTime.logDate]) this.eventLogDailies[firstEvent.eventTime.logDate] = { timeOff: 0, timeDriving: 0, timeOnDuty: 0, timeSleeper: 0, timeWorked: 0 };

          if (firstEvent.eventTime.logDate === formatDate(new Date(secondEvent.eventTime.timeStamp), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone])) {
            let timeRecap = (secondEvent.eventTime.timeStamp - firstEvent.eventTime.timeStamp) / 1000;
            switch (event.type.code.toUpperCase()) {
              case 'OFF':
              case 'PC':
                this.eventLogDailies[firstEvent.eventTime.logDate].timeOff += timeRecap;
                break;

              case 'SB':
                this.eventLogDailies[firstEvent.eventTime.logDate].timeSleeper += timeRecap;
                break;

              case 'D':
                this.eventLogDailies[firstEvent.eventTime.logDate].timeDriving += timeRecap;
                break;

              case 'ON':
              case 'YM':
                this.eventLogDailies[firstEvent.eventTime.logDate].timeOnDuty += timeRecap;
                break;
            }
          } else {
            let endTime = new Date(formatDate(new Date(secondEvent.eventTime.timeStamp), 'MMM dd hh:mm:ss a', 'en-US', this.timeZones[this.timeZone]));
            let day = formatDate(new Date(secondEvent.eventTime.timeStamp), 'yyyy/MM/dd', 'en-US', this.timeZones[this.timeZone]);
            let endDayTime = endTime.getHours() * 60 * 60 * 1000 + endTime.getMinutes() * 60 * 1000 + endTime.getSeconds() * 1000;
            const addTime = (day: string, time: number) => {
              let timeRecap2 = time / 1000;
              try {
                if (!this.eventLogDailies[day]) this.eventLogDailies[day] = { timeOff: 0, timeOnDuty: 0, timeDriving: 0, timeSleeper: 0, timeWorked: 0 };

                switch (event.type.code.toUpperCase()) {
                  case 'OFF':
                  case 'PC':
                    this.eventLogDailies[day].timeOff += timeRecap2;
                    break;

                  case 'SB':
                    this.eventLogDailies[day].timeSleeper += timeRecap2;
                    break;

                  case 'D':
                    this.eventLogDailies[day].timeDriving += timeRecap2;
                    break;

                  case 'ON':
                  case 'YM':
                    this.eventLogDailies[day].timeOnDuty += timeRecap2;
                    break;
                }
              } catch (e) {
                console.log(day);
              }
            };

            addTime(day, endDayTime);
            day = formatDate(new Date(day).setDate(new Date(day).getDate() - 1), 'yyyy/MM/dd', 'en-US');
            let iterationLimit = 100;
            while (day != firstEvent.eventTime.logDate && iterationLimit > 0) {
              addTime(day, 24 * 60 * 60 * 1000);
              let temp = new Date(day);
              temp.setDate(temp.getDate() - 1);
              day = formatDate(temp, 'yyyy/MM/dd', 'en-US');
              iterationLimit--;
            }
            let starTime = new Date(formatDate(new Date(firstEvent.eventTime.timeStamp), 'MMM dd hh:mm:ss a', 'en-US', this.timeZones[this.timeZone]));
            let startDayTime = 24 * 60 * 60 * 1000 - (starTime.getHours() * 60 * 60 * 1000 + starTime.getMinutes() * 60 * 1000 + starTime.getSeconds() * 1000);
            addTime(day, startDayTime);
          }
        }
        for (const key in this.eventLogDailies) {
          this.eventLogDailies[key].timeWorked = this.eventLogDailies[key].timeOnDuty + this.eventLogDailies[key].timeDriving;
        }
      }
    });

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

    for (const logDaily of this.logDailies) {
      if (this.eventLogDailies[logDaily.logDate]) {
        let check =
          logDaily.timeDriving !== Math.floor(this.eventLogDailies[logDaily.logDate].timeDriving) ||
          logDaily.timeOffDuty !== Math.floor(this.eventLogDailies[logDaily.logDate].timeOff) ||
          logDaily.timeOnDuty !== Math.floor(this.eventLogDailies[logDaily.logDate].timeOnDuty) ||
          logDaily.timeSleeper !== Math.floor(this.eventLogDailies[logDaily.logDate].timeSleeper);
        let check2 =
          !!this.violations[logDaily.logDate] && this.violations[logDaily.logDate].length !== 0 ? JSON.stringify(this.violations[logDaily.logDate]) !== JSON.stringify(logDaily.violations) : false;
        logDaily.violations = this.violations[logDaily.logDate] ? JSON.parse(JSON.stringify(this.violations[logDaily.logDate])) : [];
        logDaily.timeDriving = Math.floor(this.eventLogDailies[logDaily.logDate].timeDriving);
        logDaily.timeOffDuty = Math.floor(this.eventLogDailies[logDaily.logDate].timeOff);
        logDaily.timeOnDuty = Math.floor(this.eventLogDailies[logDaily.logDate].timeOnDuty);
        logDaily.timeSleeper = Math.floor(this.eventLogDailies[logDaily.logDate].timeSleeper);
        logDaily.timeWorked = Math.floor(this.eventLogDailies[logDaily.logDate].timeWorked);
        if (check || check2) {
          await this.updateLogDailies(logDaily);
          this.changeDetectorRef.detectChanges();
        }
      }
    }
  }

  pushViolation(day: string, error: { code: string; name: string }, date: number) {
    let local = {
      startTime: date,
      timeZone: '',
      regulations: {
        code: error.code,
        name: error.name,
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

  async getLocalCurrentLocation(check: boolean = true) {
    this.locationLoading = true;
    if (Capacitor.getPlatform() !== 'web') {
      if (!this.locationStatus && check) {
        this.toastService.showToast(this.translate.instant('Problems fetching location! Check the location service!'), 'danger', 2500);
      }
    }
    await this.locationService.getCurrentLocation().then(async res => {
      this.location = res;
      this.locationDescription = this.location.description;
      if (this.location.locationType === 'AUTOMATIC') {
        if (this.eldData['G']) {
          let data = this.utilityService.getEldLocation(this.eldData['G']);
          let description = await this.geolocationService.getCurrentLocation(data[2], data[3]);
          this.location = {
            locationType: 'AUTOMATIC',
            latitude: data[2],
            longitude: data[3],
            description: description,
          };
          this.locationDescription = this.location.description;
        } else {
          this.locationDisable = true;
        }
      } else {
        this.locationDisable = false;
      }
      this.locationLoading = false;
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

  async confirm(hidden: boolean = false, code?: string, validate: boolean = true, origin?: { name: string; code: string }) {
    console.log(this.selectedButton);
    console.log(this.lastSelectedButton);
    console.log(origin);
    if (validate) {
      this.shareService.changeMessage(this.utilityService.generateString(5));
      if (!this.utilityService.validateForm(this.validation)) return;
    }
    if (hidden) {
      console.log('inside hidden');
      this.shareService.destroyMessage();
      await this.onWillDismiss(code).then(() => {
        this.isModalOpen = false;
        this.modalLoading = false;
      });
    } else {
      if (this.selectedButton && this.selectedButton !== this.lastSelectedButton) {
        this.lastSelectedButton = this.selectedButton;
        this.shareService.destroyMessage();
        await this.storage.set('lastStatusCode', this.selectedButton);
        await this.onWillDismiss(this.selectedButton, origin).then(() => {
          this.currentStatusColor = this.getStatusColor(this.selectedButton);
          this.isModalOpen = false;
          this.modalLoading = false;
        });
      } else {
        this.toastService.showToast(this.translate.instant('You need to select a different status!'), 'warning');
      }
    }
  }

  async onWillDismiss(status: string, origin: { name: string; code: string } = { name: 'Driver', code: 'DRIVER' }) {
    console.log(origin);
    this.modalLoading = true;
    const endTime = new Date().getTime();
    const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];
    const filteredLogEvents = this.logEvents.filter(item => allSt.includes(item.type.code));
    let lastLogEvent = filteredLogEvents[filteredLogEvents.length - 1];
    let lastBigEvent = this.logEvents[this.logEvents.length - 1];

    if (lastLogEvent && allSt.includes(status)) {
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
      UP_NORMAL: {
        statusName: 'Engine Power-up w/ CLP',
        eventTypeType: 'DRIVER_INDICATES',
      },
      UP_REDUCED: {
        statusName: 'Engine Power-up w/ RLP',
        eventTypeType: 'DRIVER_INDICATES',
      },
      DOWN_NORMAL: {
        statusName: 'Engine Shut-down w/ CLP',
        eventTypeType: 'DRIVER_INDICATES',
      },
      DOWN_REDUCED: {
        statusName: 'Engine Power-up w/ RLP',
        eventTypeType: 'DRIVER_INDICATES',
      },
      NORMAL_PRECISION: {
        statusName: 'Intermediate w/ CLP',
        eventTypeType: 'DRIVER_INDICATES',
      },
      REDUCED_PRECISION: {
        statusName: 'Intermediate w/ RLP',
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
        eldId: this.lastEld ? this.lastEld.eldId : '00000000-0000-0000-0000-000000000000',
        macAddress: this.lastEld ? this.lastEld.macAddress : '',
        serialNumber: this.lastEld ? this.lastEld.fwVersion : '',
      },
      location: {
        locationType: this.location.locationType,
        description: this.locationDescription,
        latitude: this.location.latitude,
        longitude: this.location.longitude,
      },
      sequenceNumber: lastBigEvent ? lastBigEvent.sequenceNumber + 1 : 1,
      type: { name: statuses[status as keyof typeof statuses] ? statuses[status as keyof typeof statuses].statusName : 'Unknown', code: status },
      recordStatus: { name: 'Active', code: 'ACTIVE' },
      recordOrigin: origin,
      odometer: this.eldData['O'] ? parseInt(this.eldData['O']) : 1,
      engineHours: this.eldData['H'] ? parseInt(this.eldData['H']) : 1,
      malfunction: false,
      dataDiagnosticEvent: false,
      certificationDate: lastLogEvent.certificationDate,
      comment: this.comments,
      eventDataCheck: '',
      inspection: false,

      sent: true,
    };
    if (status.includes('PRECISION')) {
      newLogEvent.eventTime.timeStamp = this.currentDriving.start + this.currentDriving.index * 5 * 60 * 1000;
    }

    if (this.networkStatus) {
      await this.dashboardService
        .updateLogEvent(lastLogEvent)
        .toPromise()
        .then(async response => {
          console.log('Last LogEvent is updated on server:', response);
          await this.updateIndexLogEvents(lastLogEvent, true);
        })
        .catch(async () => {
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
        .catch(async () => {
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
    await this.calcViolations();
    await this.uploadDriverStatus();
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
    this.handleSplitSleep(value);
    await this.calcViolations();
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
        async () => {
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
        OFF: 'var(--off-duty)',
        SB: 'var(--split-spleeper-berth)',
        ON: 'var(--warning-400)',
        D: 'var(--success-500)',
        PC: 'var(--off-duty)',
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
      await this.calcViolations();
      await this.uploadDriverStatus();
      await this.createIntermediate();
    }, 60000);
  }

  getTotalWorkedHours() {
    return this.logDailies.slice(1, 8).reduce((accumulator, currentValue) => {
      return accumulator + (currentValue.timeWorked === undefined || currentValue.timeWorked === null ? 0 : currentValue.timeWorked);
    }, 0);
  }

  goToConnectPage() {
    this.navCtrl.navigateForward('/connect-mac', { queryParams: { backUrl: '/hos' } });
  }

  async changeDrivingAutomatically() {
    console.log(this.currentStatus);
    if (parseInt(this.eldData['V']) >= 5 && this.currentStatus.statusCode !== 'D') {
      console.log('changeDrivingAuto first if');
      await this.changeStatusLocally('D', true, true, false, { name: 'Auto', code: 'AUTO' });
      this.closeAutoDrivingModal();
    } else if (parseInt(this.eldData['V']) === 0 && parseInt(this.eldData['R']) === 0 && this.currentStatus.statusCode === 'D') {
      console.log('changeDrivingAuto second if');
      await this.changeStatusLocally('ON', true, true, false, { name: 'Auto', code: 'AUTO' });
      this.closeAutoDrivingModal();
    } else if (parseInt(this.eldData['V']) < 5 && this.currentStatus.statusCode === 'D') {
      console.log('changeDrivingAuto third if');
      if (!this.slowDownTimeout) {
        this.slowDownTimoutRemaining = 60; // to be changes
        this.slowDownTimeout = setTimeout(async () => {
          if (this.currentStatus.statusCode === 'D') {
            this.isDrivingAuto = true;
            this.changeDetectorRef.detectChanges();
            this.slowDownTimoutRemainingInterval = setInterval(async () => {
              this.changeDetectorRef.detectChanges();
              this.ngZone.run(async () => {
                if (this.slowDownTimoutRemaining === 0) {
                  this.closeAutoDrivingModal();
                  await this.changeStatusLocally('ON', true, true, false, { name: 'Auto', code: 'AUTO' });
                }
                this.slowDownTimoutRemaining--;
              });
            }, 1000);
          }
        }, 4000); // to be changed
      }
    } else {
      console.log('changeDrivingAuto else');
      this.closeAutoDrivingModal();
    }
  }

  async powerUpAndDown() {
    if (this.eldData['R']) {
      console.log(parseInt(this.eldData['R']), ' ', this.lastRPM);
      if (parseInt(this.eldData['R']) > 0 && this.lastRPM === 0) {
        if (this.eldData['O'] && this.eldData['H']) {
          await this.changeStatusLocally('UP_NORMAL', false, false, true);
        } else {
          await this.changeStatusLocally('UP_REDUCED', false, false, true);
        }
      } else if (parseInt(this.eldData['R']) === 0 && this.lastRPM > 0) {
        if (this.eldData['O'] && this.eldData['H']) {
          await this.changeStatusLocally('DOWN_NORMAL', false, false, true);
        } else {
          await this.changeStatusLocally('DOWN_REDUCED', false, false, true);
        }
      }
    }
    this.lastRPM = this.eldData['R'] ? parseInt(this.eldData['R']) : 0;
  }

  async changeStatusLocally(code: string, loading: boolean = true, select: boolean = true, hidden: boolean = false, origin?: { name: string; code: string }) {
    if (!hidden) this.closeAutoDrivingModal();
    if (!hidden) this.autoChangeLoading = true;
    if (select) this.selectButton(code);
    await this.getLocalCurrentLocation(false);
    this.validation['location'] = true;
    this.autoChangeLoading = false;
    await this.confirm(hidden, code, false, origin).catch(() => (this.autoChangeLoading = false));
  }

  closeAutoDrivingModal() {
    this.isDrivingAuto = false;
    if (this.slowDownTimeout) {
      clearTimeout(this.slowDownTimeout);
      clearInterval(this.slowDownTimoutRemainingInterval);
      this.slowDownTimeout = null;
    }
    this.changeDetectorRef.detectChanges();
  }

  async showBannerInfoMessage() {
    if (Capacitor.getPlatform() !== 'web') {
      let bluetoothServiceState = await this.bluetoothService.getBluetoothState();
      let bluetoothAuthorization = (await this.bluetoothService.getBluetoothAuthorizationStatus()).status;

      if (!this.networkStatus) {
        this.bannerInfo = {
          show: true,
          title: 'Offline Mode',
          subtitle: 'Check your internet connection.',
          type: 'warning',
        };
        this.changeDetectorRef.detectChanges();
        return;
      } else {
        this.bannerInfo.show = false;
        this.changeDetectorRef.detectChanges();
      }

      if (!bluetoothServiceState) {
        this.bannerInfo = {
          show: true,
          title: 'Bluetooth Service Off',
          subtitle: 'Please turn on the Bluetooth Service.',
          type: 'error',
        };
        this.changeDetectorRef.detectChanges();
        return;
      } else {
        this.bannerInfo.show = false;
        this.changeDetectorRef.detectChanges();
      }

      if (!bluetoothAuthorization) {
        this.bannerInfo = {
          show: true,
          title: 'Bluetooth not authorized',
          subtitle: 'Please give permissions to use the bluetooth service.',
          type: 'error',
        };
        this.changeDetectorRef.detectChanges();
        return;
      } else {
        console.log('inside third if');
        this.bannerInfo.show = false;
        this.changeDetectorRef.detectChanges();
      }

      if (!this.deviceConStatus) {
        this.bannerInfo = {
          show: true,
          title: 'ELD Not Connected',
          subtitle: 'Please verify the ELD hardware connection.',
          type: 'error',
        };
        this.changeDetectorRef.detectChanges();
        return;
      } else {
        this.bannerInfo.show = false;
        this.changeDetectorRef.detectChanges();
      }
    }
  }

  async createIntermediate() {
    const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];
    if (this.currentStatus.statusCode === 'D') {
      let visibleLogs = this.logEvents
        .filter(el => allSt.includes(el.type.code))
        .slice()
        .reverse();
      console.log(visibleLogs);
      let localDriving = visibleLogs.find(el => el.type.code === 'D');
      let numberOfIntermetdiates = 1;
      let reverseLogs = this.logEvents.slice().reverse();
      reverseLogs.every(el => {
        if (el.type.code === 'NORMAL_PRECISION') {
          numberOfIntermetdiates++;
        }
        if (el.type.code === 'D') return false;
        return true;
      });
      this.currentDriving.start = localDriving.eventTime.timeStamp;
      this.currentDriving.index = numberOfIntermetdiates;

      // console.log(((new Date().getTime() - this.currentDriving.start) / 1000) % 300 < 60);
      // console.log(((new Date().getTime() - this.currentDriving.start) / 1000) % 300);

      if (new Date().getTime() - this.currentDriving.start > 60000 && ((new Date().getTime() - this.currentDriving.start) / 1000) % 300 < 60) {
        //to be changed
        console.log('intermediate');
        await this.changeStatusLocally('NORMAL_PRECISION', false, false, true, { name: 'Auto', code: 'AUTO' });
      }
    } else {
      this.currentDriving = { start: 0, index: 0 };
    }
  }

  async ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
    if (this.eldDataSub) {
      this.eldDataSub.unsubscribe();
    }
  }

  canDeactivate() {
    return !this.autoChangeLoading;
  }

  checkElementHasChildren(id: string) {
    let value = document.getElementsByClassName(id).length > 0;
    return value;
  }

  getPlatform() {
    return Capacitor.getPlatform();
  }
}
