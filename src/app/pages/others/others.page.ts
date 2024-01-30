import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DashboardService } from 'src/app/services/dashboard.service';
import { InternetService } from 'src/app/services/internet.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { LogEvents } from 'src/app/models/log-histories';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { timeZone } from 'src/app/models/timeZone';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.page.html',
  styleUrls: ['./others.page.scss'],
})
export class OthersPage implements OnInit {
  logEvents: LogEvents[] = [];

  networkStatus = false;
  networkSub!: Subscription;
  databaseSubscription: Subscription | undefined;
  TimeZoneCity: string = '';
  vehicleId: string = '';
  driverId: string = '';
  companyId: string = '';
  bAuthorized!: boolean;
  bReady: boolean = false;

  isModalOpen: boolean = false;

  lastStatusCode: string = '';

  autoLogin: boolean = false;

  loading: boolean = false;

  statusList: { [key: string]: string } = {
    OFF: 'Off Duty',
    SB: 'Sleeper Berth',
    ON: 'On Duty',
    D: 'Driving',
    PC: 'Personal Conveyance',
    YM: 'Yard Moves',
  };

  forbiddenStatuses: string[] = ['ON', 'D', 'PC', 'YM'];

  constructor(
    private navCtrl: NavController,
    private databaseService: DatabaseService,
    private dashboardService: DashboardService,
    private internetService: InternetService,
    private storage: Storage,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {}

  async ionViewWillEnter() {
    console.log('ohters page');
    let vehicleId$ = this.storage.get('vehicleId');
    let driverId$ = this.storage.get('driverId');
    let companyId$ = this.storage.get('companyId');
    let TimeZoneCity$ = this.storage.get('TimeZoneCity');
    let bAuthorized$ = this.storage.get('bAuthorized');
    let lastStatusCode$ = this.storage.get('lastStatusCode');
    let autoLogin$ = this.storage.get('autoLogin');
    let logEvents$ = firstValueFrom(this.databaseService.getLogEvents());

    forkJoin([vehicleId$, driverId$, companyId$, TimeZoneCity$, bAuthorized$, lastStatusCode$, autoLogin$, logEvents$]).subscribe(
      ([vehicleId, driverId, companyId, TimeZoneCity, bAuthorized, lastStatusCode, autoLogin, logEvents]) => {
        this.vehicleId = vehicleId;
        this.driverId = driverId;
        this.companyId = companyId;
        this.TimeZoneCity = TimeZoneCity;
        this.bAuthorized = bAuthorized;
        this.lastStatusCode = lastStatusCode;
        if (autoLogin !== null && autoLogin !== undefined) {
          this.autoLogin = autoLogin;
        }
        this.logEvents = logEvents;
      }
    );

    this.networkSub = this.internetService.internetStatus$.subscribe(status => {
      this.networkStatus = status;
      console.log('Intenet Status' + status);
    });
  }

  onVehicleClick() {
    localStorage.setItem('showBackButton', JSON.stringify(true));
    this.navCtrl.navigateForward('/select-vehicle');
  }

  onCoDriverClick() {
    this.navCtrl.navigateForward('/co-driver');
  }

  onAccountClick() {
    this.navCtrl.navigateForward('/account');
  }

  onRulesClick() {
    this.navCtrl.navigateForward('/rules');
  }

  onInformationClick() {
    this.navCtrl.navigateForward('/information');
  }

  logoutConfirm() {
    this.isModalOpen = true;
  }

  async onLogoutClick() {
    if (this.bAuthorized === true) {
      this.loading = true;
      const lastLogEvent = this.logEvents[this.logEvents.length - 1];

      if (lastLogEvent) lastLogEvent.eventTime.timeStampEnd = new Date(formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en_US', timeZone[this.TimeZoneCity as keyof typeof timeZone])).getTime();

      let LogoutLogEvent: LogEvents = {
        logEventId: this.utilityService.uuidv4(),
        companyId: '',
        driverId: this.driverId,
        eventTime: {
          logDate: formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en_US', timeZone[this.TimeZoneCity as keyof typeof timeZone]),
          timeStamp: new Date().getTime(),
          timeStampEnd: new Date().getTime(),
          timeZone: '',
        },
        vehicle: {
          vehicleId: this.vehicleId,
        },
        location: {
          locationType: 'AUTOMATIC',
          description: '2mi from Chisinau, Chisinau',
          latitude: 0,
          longitude: 0,
        },
        sequenceNumber: lastLogEvent ? lastLogEvent.sequenceNumber + 1 : 1,
        type: { name: 'Logout', code: 'LOGOUT' },
        recordStatus: { name: 'Driver', code: 'DRIVER' },
        recordOrigin: { name: 'Active', code: 'ACTIVE' },
        odometer: 0,
        engineHours: 0,
        malfunction: false,
        dataDiagnosticEvent: false,
        certificationDate: '',
        comment: '',
        eventDataCheck: '',
        inspection: false,
      };

      this.storage.set('bAuthorized', false);

      await this.updateLogEvents(LogoutLogEvent, false);
      await this.dashboardService
        .updateLogEvent(LogoutLogEvent)
        .toPromise()
        .then(async response => {
          console.log('Login LogEvents got updated on the server: ', response);
          await this.updateIndexLogEvents(LogoutLogEvent, true);
        })
        .catch(async error => {
          console.log('Internet Status: ' + this.networkStatus);
          console.log('Login LogEvent in offline logEvents array');
        });

      await this.updateIndexLogEvents(lastLogEvent, false);
      await this.dashboardService
        .updateLogEvent(lastLogEvent)
        .toPromise()
        .then(async response => {
          console.log('Second Last LogEvent is updated on server:', response);
          await this.updateIndexLogEvents(lastLogEvent, true);
        })
        .catch(async error => {
          console.log('Internet Status: ' + this.networkStatus);
          console.log('Second Last LogEvent Pushed in offline logEvents array');
        });
    }
    this.loading = false;
    this.storage.remove('accessToken');
    this.storage.remove('pickedVehicle');
    this.isModalOpen = false;
    setTimeout(() => this.navCtrl.navigateForward('/login', { replaceUrl: true }), 0)
  }

  toggleCheck() {
    if (this.autoLogin) {
      this.autoLogin = false;
    } else {
      this.autoLogin = true;
    }
  }

  isForbidden(currentStatus: string): boolean {
    return this.forbiddenStatuses.includes(currentStatus);
  }

  async updateLogEvents(logEventData: LogEvents, online: boolean) {
    logEventData.sent = online;
    this.logEvents.push(logEventData);
    await this.storage.set('logEvents', this.logEvents);
  }

  async updateIndexLogEvents(logEventData: LogEvents, online: boolean) {
    logEventData.sent = online;
    const index = this.logEvents.findIndex(item => item.logEventId === logEventData.logEventId);
    if (index !== -1) {
      this.logEvents[index] = logEventData;
    }
    await this.storage.set('logEvents', this.logEvents);
  }

  goSwitchStatus() {
    this.isModalOpen = false;
    setTimeout(() => this.navCtrl.navigateBack('unitab/hos'), 0);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
    this.networkSub.unsubscribe();
  }
}
