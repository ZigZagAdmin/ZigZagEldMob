import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DashboardService } from 'src/app/services/dashboard.service';
import { InternetService } from 'src/app/services/internet.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { LogEvents } from 'src/app/models/log-histories';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import { timeZone } from 'src/app/models/timeZone';

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
    this.bAuthorized = await this.storage.get('bAuthorized');
    this.databaseSubscription = this.databaseService.databaseReadySubject.subscribe((ready: boolean) => {
      if (ready) {
        this.bReady = ready;
        this.databaseService.getLogEvents().subscribe(logEvents => {
          this.logEvents = logEvents;
        });
      }
    });
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

  onLogoutClick() {
    if (this.bAuthorized === true) {
      const lastLogEvent = this.logEvents[this.logEvents.length - 1];

      if (lastLogEvent) lastLogEvent.eventTime.timeStampEnd = new Date(formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en_US', timeZone[this.TimeZoneCity as keyof typeof timeZone])).getTime();

      let LogoutLogEvent: LogEvents = {
        logEventId: this.uuidv4(),
        companyId: '',
        driverId: this.driverId,
        eventTime: {
          logDate: '',
          timeStamp: new Date().getTime(),
          timeStampEnd: new Date().getTime(),
          timeZone: '',
        },
        vehicle: {
          vehicleId: this.vehicleId,
        },
        eld: {
          eldId: '',
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
      this.logEvents.push(LogoutLogEvent);
      this.storage.set('bAuthorized', false);
      this.storage.set('logEvents', this.logEvents);

      this.dashboardService.updateLogEvent(LogoutLogEvent).subscribe(
        response => {
          console.log('Logout LogEvent is updated on server:', response);
        },
        async error => {
          console.log('Internet Status' + this.networkStatus);
          let tempEerror = {
            url: 'api/eldDashboard/UploadLogDailies',
            body: LogoutLogEvent,
          };
          let offlineArray = await this.storage.get('offlineArray');
          offlineArray.push(tempEerror);
          await this.storage.set('offlineArray', offlineArray);
          console.log('Logout LogEvent Pushed in offlineArray');
        }
      );

      this.dashboardService.updateLogEvent(lastLogEvent).subscribe(
        response => {
          console.log('Predposlednii LogEvent is updated on server:', response);
        },
        async error => {
          console.log('Internet Status' + this.networkStatus);
          let tempEerror = {
            url: 'api/eldDashboard/UploadLogEvent',
            body: lastLogEvent,
          };
          let offlineArray = await this.storage.get('offlineArray');
          offlineArray.push(tempEerror);
          await this.storage.set('offlineArray', offlineArray);
          console.log('Predposlednii LogEvent Pushed in offlineArray');
        }
      );
    }
    this.storage.remove('accessToken');
    this.storage.remove('pickedVehicle');
    this.navCtrl.navigateForward('/login', { replaceUrl: true });
    // Обработчик нажатия кнопки "Logout"
    // Добавьте здесь код для выполнения выхода из аккаунта или другой логики
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  ionViewWillLeave() {
    if (this.databaseSubscription) {
      this.databaseSubscription.unsubscribe();
    }
    this.networkSub.unsubscribe();
  }
}
