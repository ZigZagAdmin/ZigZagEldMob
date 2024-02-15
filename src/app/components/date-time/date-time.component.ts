import { formatDate } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { ShareService } from 'src/app/services/share.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
})
export class DateTimeComponent implements OnInit, OnDestroy {
  @Input() label: string;
  @Input() fill: boolean = true;
  @Input() validators: { regex: RegExp; message: string }[] = [];
  @Input() noValidation: boolean = false;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showDisabled: boolean = false;
  @Input() labelPosition: 'top' | 'left' = 'top';
  @Input() timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  @Input() set type(_type: string) {
    this.localType = _type;
    if (this.localType !== 'date-time') {
      this.enableWheel = true;
    }
  }

  @Input() value: number = 0;

  @Output() emitValue: EventEmitter<number> = new EventEmitter<number>();

  _validation: boolean;

  @Input()
  get validation(): boolean {
    return this._validation;
  }

  @Output() validationChange = new EventEmitter<boolean>();

  set validation(newValue: boolean) {
    if (this._validation !== newValue) {
      this._validation = newValue;
      this.validationChange.emit(newValue);
    }
  }

  valid: boolean = true;

  isModalOpen: boolean = false;

  id: string = '';

  localType: string = 'date-time';
  enableWheel: boolean = false;

  displayValue: string = '';
  formValue: string = '';

  previousValue: string = '';
  previousDisplayValue: string = '';

  timeZones: { [key: string]: string } = {};

  chosenTimeDifference: number = 0;

  seconds: number = 0;

  validateSubscription: Subscription;

  constructor(private utilityService: UtilityService, private shareService: ShareService) {}

  async ngOnInit() {
    this.validateSubscription = this.shareService.currentMessage.subscribe(data => {
      if (data === 'reset') {
        this.valid = true;
      } else if (data === 'invalidate' && !this.noValidation) {
        this.valid = false;
      }
    });
    this.timeZones = this.utilityService.checkSeason();
    this.id = this.utilityService.generateString(8);
    if (!this.value) {
      this.formValue = formatDate(new Date(), 'YYYY-MM-ddTHH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]);
      this.value = new Date(this.formValue).getTime();
    } else {
      this.formValue = formatDate(this.value, 'YYYY-MM-ddTHH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]);
    }
    this.seconds = Math.floor((this.value % 60000) / 1000);
    this.selectDate(this.convertValueWithTimeZone(this.value));
    this.previousDisplayValue = this.displayValue;
    this.previousValue = this.formValue;
  }

  ngOnDestroy(): void {
    this.validateSubscription.unsubscribe();
  }

  selectDate(value: Event | string | number) {
    // console.log('before', this.formValue);
    this.formValue = typeof value === 'string' ? value : (value as CustomEvent).detail.value;
    // console.log('after', this.formValue);
    switch (this.localType) {
      case 'date-time':
        this.displayValue = formatDate(this.formValue, "LLL d'th', yyyy hh:mm a", 'en_US');
        break;
      case 'date':
        this.displayValue = formatDate(this.formValue, "LLL d'th', yyyy", 'en_US');
        break;
      case 'time':
        this.displayValue = formatDate(this.formValue, 'hh:mm a', 'en_US').slice(0, 5) + ':' + this.seconds.toString().padStart(2, '0') + formatDate(this.formValue, 'hh:mm a', 'en_US').slice(5);
        break;
    }
  }

  convertValue(value: number) {
    return formatDate(value, 'YYYY-MM-ddTHH:mm:ss', 'en_US');
  }

  convertValueWithTimeZone(value: number) {
    return formatDate(value, 'YYYY-MM-ddTHH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]);
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.formValue = this.previousValue;
    this.displayValue = this.previousDisplayValue;
  }

  submit() {
    this.isModalOpen = false;
    this.previousValue = this.formValue as string;
    this.previousDisplayValue = this.displayValue;
    this.chosenTimeDifference = new Date(this.formValue).getTime() - new Date(this.convertValueWithTimeZone(this.value)).getTime();
    // console.log(this.formValue);
    // console.log(this.value);
    // console.log(this.chosenTimeDifference);
    // console.log(this.seconds);
    this.emitValue.emit(this.value + this.chosenTimeDifference + this.seconds * 1000); // always returns without timeZone
  }
}
