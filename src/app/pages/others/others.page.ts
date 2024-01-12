import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DashboardService } from 'src/app/services/dashboard.service';
import { InternetService } from 'src/app/services/internet.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { LogHistories } from 'src/app/models/log-histories';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-others',
  templateUrl: './others.page.html',
  styleUrls: ['./others.page.scss'],
})
export class OthersPage implements OnInit {
  logHistories: LogHistories[] = [];

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
        this.databaseService.getLogHistories().subscribe(LogHistories => {
          this.logHistories = LogHistories;
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
      const lastLogHistory = this.logHistories[this.logHistories.length - 1];

      lastLogHistory.DateEnd = formatDate(
        new Date().toLocaleString('en-US', {
          timeZone: this.TimeZoneCity,
        }),
        'yyyy-MM-ddTHH:mm:ss',
        'en_US'
      );

      let LogoutLogHistory: LogHistories = {
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
        EventSequenceNumber: lastLogHistory ? lastLogHistory.EventSequenceNumber + 1 : 1,
        EventTypeCode: 'LOGOUT',
        EventTypeName: 'Logout',
        EventTypeType: 'LOGOUT',
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
      this.logHistories.push(LogoutLogHistory);
      this.storage.set('bAuthorized', false);
      this.storage.set('logHistories', this.logHistories);

      this.dashboardService.updateLogHistory(LogoutLogHistory).subscribe(
        response => {
          console.log('Logout LogHistory is updated on server:', response);
        },
        async error => {
          console.log('Internet Status' + this.networkStatus);
          let tempEerror = {
            url: 'api/eldDashboard/UploadLogDailies',
            body: LogoutLogHistory,
          };
          let offlineArray = await this.storage.get('offlineArray');
          offlineArray.push(tempEerror);
          await this.storage.set('offlineArray', offlineArray);
          console.log('Logout LogHistory Pushed in offlineArray');
        }
      );

      this.dashboardService.updateLogHistory(lastLogHistory).subscribe(
        response => {
          console.log('Predposlednii LogHistory is updated on server:', response);
        },
        async error => {
          console.log('Internet Status' + this.networkStatus);
          let tempEerror = {
            url: 'api/eldDashboard/UploadLogHistories',
            body: lastLogHistory,
          };
          let offlineArray = await this.storage.get('offlineArray');
          offlineArray.push(tempEerror);
          await this.storage.set('offlineArray', offlineArray);
          console.log('Predposlednii LogHistory Pushed in offlineArray');
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
