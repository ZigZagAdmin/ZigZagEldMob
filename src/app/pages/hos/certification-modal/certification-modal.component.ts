import { formatDate } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Network } from '@capacitor/network';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, firstValueFrom } from 'rxjs';
import { LogDailies } from 'src/app/models/log-dailies';
import { LogEvents } from 'src/app/models/log-histories';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ShareService } from 'src/app/services/share.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-certification-modal',
  templateUrl: './certification-modal.component.html',
  styleUrls: ['./certification-modal.component.scss'],
})
export class CertificationModalComponent implements OnInit {
  @Input() set logDailies(value: LogDailies[]) {
    this._logDailies = value.slice();
    this.filteredDays = value
      .slice()
      .filter(el => !el.certified && el.logDate !== value[0].logDate)
      .map(el => {
        return { label: el.logDate, form: el.formManner || !this.hasLogEvents(el), checked: false, logDailyId: el.logDailyId };
      })
      .slice(0, 13);
  }

  @Input() logEvents: LogEvents[] = [];
  @Input() timeZone: string = '';
  @Input() vehicleId: string = '';
  @Input() signature: { signatureLink: string; foundSignatureId: string };

  @Output() closeCallback: EventEmitter<void> = new EventEmitter<void>();
  @Output() submitCallback: EventEmitter<void> = new EventEmitter<void>();

  filteredDays: { label: string; form: boolean; checked: boolean; logDailyId: string }[];

  _logDailies: LogDailies[] = [];

  selectAll: boolean = false;
  loading: boolean = false;

  timeZones: { [key: string]: string } = {};

  constructor(
    private toastService: ToastService,
    private shareService: ShareService,
    private translate: TranslateService,
    private utilityService: UtilityService,
    private storage: Storage,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.timeZones = this.utilityService.checkSeason();
  }

  ngOnDestroy() {}

  selectAllDays() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.filteredDays.forEach(el => (el.form ? (el.checked = true) : null));
    } else {
      this.filteredDays.forEach(el => (el.checked = false));
    }
  }

  selectDay(day: { label: string; form: boolean; checked: boolean }) {
    day.checked = !day.checked;
  }

  formatDateL(value: string) {
    return formatDate(new Date(value), 'LLL d, yyyy', 'en-US');
  }

  close() {
    this.closeCallback.emit();
  }

  async submit() {
    let logIds = this.filteredDays
      .slice()
      .filter(el => el.checked)
      .map(el => el.logDailyId);
    if (logIds.length === 0) {
      this.toastService.showToast('Please select at least one day to sign');
      return;
    }
    console.log(logIds);
    let filteredLogDailies = this._logDailies.slice().filter(el => logIds.includes(el.logDailyId));

    await this.save(filteredLogDailies);
    this.submitCallback.emit();
  }

  async save(logDailies: LogDailies[]) {
    this.loading = true;

    for (let logDaily of logDailies) {
      logDaily.form.signatureId = this.signature.foundSignatureId;
      logDaily.form.signatureLink = this.signature.signatureLink;
      logDaily.certified = true;
      logDaily.formManner = true;

      const lastLogEvent = this.logEvents[this.logEvents.length - 1];

      let CetificationLogEvent: LogEvents = {
        logEventId: this.utilityService.uuidv4(),
        companyId: '',
        driverId: logDaily.driverId,
        eventTime: {
          logDate: formatDate(new Date(), 'yyyy/MM/dd', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]),
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
        sequenceNumber: lastLogEvent ? lastLogEvent.sequenceNumber + 1 : 1,
        type: { name: 'Certification (1)', code: 'CERTIFICATION_1' },
        recordStatus: { name: 'Active', code: 'ACTIVE' },
        malfunction: false,
        dataDiagnosticEvent: false,
        certificationDate: logDaily?.logDate,
        comment: '',
        eventDataCheck: '',
        inspection: false,
      };

      let networkStatus = (await Network.getStatus()).connected;

      if (networkStatus) {
        await firstValueFrom(this.dashboardService.updateLogEvent(CetificationLogEvent)).then(
          async response => {
            await this.updateLogEvents(CetificationLogEvent, true);
            console.log('Certification LogEvent is on server:', response);
          },
          async error => {
            console.log('Cerification LogEvent Pushed in offline logEvents array');
            await this.updateLogEvents(CetificationLogEvent, false);
          }
        );

        await firstValueFrom(this.dashboardService.updateLogDaily(logDaily as LogDailies)).then(
          async (response: any) => {
            this.toastService.showToast(this.translate.instant('Successfully signed the log certification. (' + logDaily.logDate + ')'), 'success');
            if (response.signatureLink) logDaily.form.signatureLink = response.signatureLink;
            await this.updateIndexLogDaily(logDaily as LogDailies, true);
          },
          async error => {
            this.toastService.showToast(this.translate.instant('Could not update the signture. Uploading offline only.'));
            await this.updateIndexLogDaily(logDaily as LogDailies, false);
          }
        );
      } else {
        console.log('Updated logEvents in offline array');
        await this.updateIndexLogDaily(logDaily as LogDailies, false);
        await this.updateLogEvents(CetificationLogEvent, false);
      }
    }

    this.loading = false;
    this.close();
  }

  async updateLogDaily(logDailyData: LogDailies, online: boolean) {
    logDailyData.sent = online;
    this._logDailies.push(logDailyData);
    await this.storage.set('logDailies', this._logDailies);
  }

  async updateIndexLogDaily(logDailyData: LogDailies, online: boolean) {
    logDailyData.sent = online;
    const index = this._logDailies.findIndex(item => item.logDailyId === logDailyData.logDailyId);
    if (index !== -1) {
      this._logDailies[index] = logDailyData;
    }
    await this.storage.set('logDailies', this._logDailies);
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

  hasLogEvents(logDaily: LogDailies) {
    const allSt = ['OFF', 'SB', 'D', 'ON', 'PC', 'YM'];
    for(let logEvent of this.logEvents) {
      if(logDaily.logDate === logEvent.eventTime.logDate && allSt.includes(logEvent.type.code)) {
        return true;
      }
    }
    return false;
  }
}
