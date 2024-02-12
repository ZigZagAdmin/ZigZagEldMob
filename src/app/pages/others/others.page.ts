import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DashboardService } from 'src/app/services/dashboard.service';
import { InternetService } from 'src/app/services/internet.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { LogEvents } from 'src/app/models/log-histories';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { timeZones } from 'src/app/models/timeZone';
import { UtilityService } from 'src/app/services/utility.service';
import { Network } from '@capacitor/network';
import { ManageService } from 'src/app/services/manage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.page.html',
  styleUrls: ['./others.page.scss'],
})
export class OthersPage implements OnInit {
  logEvents: LogEvents[] = [];

  databaseSubscription: Subscription | undefined;
  timeZone: string = '';
  vehicleId: string = '';
  driverId: string = '';
  companyId: string = '';
  bAuthorized!: boolean;
  bReady: boolean = false;

  isModalOpen: boolean = false;

  lastStatusCode: string = '';

  autoLogin: boolean = true;

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

  syncLoading: boolean = false;

  constructor(
    private navCtrl: NavController,
    private databaseService: DatabaseService,
    private dashboardService: DashboardService,
    private internetService: InternetService,
    private storage: Storage,
    private utilityService: UtilityService,
    private manageService: ManageService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  async ionViewWillEnter() {
    let vehicleId$ = this.storage.get('vehicleId');
    let driverId$ = this.storage.get('driverId');
    let companyId$ = this.storage.get('companyId');
    let timeZone$ = this.storage.get('timeZone');
    let bAuthorized$ = this.storage.get('bAuthorized');
    let lastStatusCode$ = this.storage.get('lastStatusCode');
    let autoLogin$ = this.storage.get('autoLogin');
    let logEvents$ = firstValueFrom(this.databaseService.getLogEvents());

    forkJoin([vehicleId$, driverId$, companyId$, timeZone$, bAuthorized$, lastStatusCode$, autoLogin$, logEvents$]).subscribe(
      ([vehicleId, driverId, companyId, timeZone, bAuthorized, lastStatusCode, autoLogin, logEvents]) => {
        this.vehicleId = vehicleId;
        this.driverId = driverId;
        this.companyId = companyId;
        this.timeZone = timeZone;
        this.bAuthorized = bAuthorized;
        this.lastStatusCode = lastStatusCode;
        if (autoLogin !== null && autoLogin !== undefined) {
          this.autoLogin = autoLogin;
        }
        this.logEvents = logEvents;
      }
    );
  }

  async syncData() {
    if (!(await Network.getStatus()).connected) {
      this.toastService.showToast('Cannot sync data while offline!', 'warning');
      return;
    }
    this.syncLoading = true;
    this.toastService.showToast('Syncing data... Please wait.', 'medium');
    let driver$ = firstValueFrom(this.manageService.getDrivers(this.driverId));
    let drivers$ = firstValueFrom(this.manageService.getDrivers('ALL'));
    let company$ = firstValueFrom(this.manageService.getCompany());
    let terminals$ = firstValueFrom(this.manageService.getTerminals());
    let elds$ = firstValueFrom(this.manageService.getELDs());
    let dvirs$ = firstValueFrom(this.manageService.getDVIRs());
    let logDailies$ = firstValueFrom(this.manageService.getLogDailies(this.driverId, formatDate(new Date(), 'yyyy-MM-dd', 'en_US'), 14));
    let logEvents$ = firstValueFrom(this.manageService.getLogEvents(this.driverId));

    forkJoin([driver$, drivers$, company$, terminals$, elds$, dvirs$, logDailies$, logEvents$]).subscribe(
      async ([driver, drivers, company, terminals, elds, dvirs, logDailies, logEvents]) => {
        await this.storage.set('drivers', driver);
        await this.storage.set('coDrivers', drivers);
        await this.storage.set('company', company);
        await this.storage.set('terminals', terminals);
        await this.storage.set('elds', elds);
        await this.storage.set('dvirs', dvirs);
        await this.storage.set('logDailies', logDailies);
        await this.storage.set('logEvents', logEvents);
        await this.storage.set('HoursOfServiceRuleDays', driver[0]?.driverInfo?.settings?.hoursOfService?.days);
        await this.storage.set('HoursOfServiceRuleHours', driver[0]?.driverInfo?.settings?.hoursOfService?.hours);
        await this.storage.set('companyId', company?.companyId);
        await this.storage.set('driverId', driver[0]?.driverId);
        await this.storage.set('name', driver[0]?.name);
        // await this.storage.set('vehicles', driver[0]?.driverInfo?.assignedVehicles[0]);
        // await this.storage.set('vehicleId', driver[0]?.driverInfo?.assignedVehicles[0]?.vehicleId);
        // await this.storage.set('vehicleUnit', driver[0]?.driverInfo?.assignedVehicles[0]?.vehicleUnit);
        this.toastService.showToast('Data successfully synced', 'success');
        this.syncLoading = false;
      },
      async error => {
        this.toastService.showToast('There was a problem syncing data.', 'error');
        this.syncLoading = false;
      }
    );
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

      if (lastLogEvent) lastLogEvent.eventTime.timeStampEnd = new Date(formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en_US', timeZones[this.timeZone as keyof typeof timeZones])).getTime();

      let LogoutLogEvent: LogEvents = {
        logEventId: this.utilityService.uuidv4(),
        companyId: '',
        driverId: this.driverId,
        eventTime: {
          logDate: formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en_US', timeZones[this.timeZone as keyof typeof timeZones]),
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
        recordStatus: { name: 'Active', code: 'ACTIVE' },
        recordOrigin: { name: 'Driver', code: 'DRIVER' },
        odometer: 0,
        engineHours: 0,
        malfunction: false,
        dataDiagnosticEvent: false,
        comment: '',
        eventDataCheck: '',
        inspection: false,
      };

      this.storage.set('bAuthorized', false);
      this.storage.set('autoLogin', this.autoLogin);

      let networkStatus = (await Network.getStatus()).connected;

      if (networkStatus) {
        this.dashboardService
          .updateLogEvent(lastLogEvent)
          .toPromise()
          .then(async response => {
            console.log('Last LogEvent is updated on server:', response);
            await this.updateIndexLogEvents(lastLogEvent, true);
          })
          .catch(async error => {
            console.log('Internet Status: ' + networkStatus);
            console.log('Last LogEvent Pushed in offline logEvents array');
            await this.updateIndexLogEvents(lastLogEvent, false);
          });
        this.dashboardService
          .updateLogEvent(LogoutLogEvent)
          .toPromise()
          .then(response => {
            console.log('New status is updated on server:', response);
            this.updateLogEvents(LogoutLogEvent, true);
          })
          .catch(async error => {
            console.log('Internet Status: ' + networkStatus);
            console.log('New Log Event Status Pushed in offline logEvents Array');
            this.updateLogEvents(LogoutLogEvent, false);
          });
      } else {
        console.log('Updated logEvents in offline array');
        await this.updateIndexLogEvents(lastLogEvent, false);
        this.updateLogEvents(LogoutLogEvent, false);
      }
    }
    this.loading = false;
    this.storage.remove('accessToken');
    this.storage.remove('pickedVehicle');
    this.isModalOpen = false;
    setTimeout(() => this.navCtrl.navigateForward('/login', { replaceUrl: true }), 0);
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
  }
}
