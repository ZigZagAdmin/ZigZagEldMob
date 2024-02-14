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
export class DateTimeComponent implements OnInit {
  @Input() label: string;
  @Input() fill: boolean = true;
  @Input() validators: { regex: RegExp; message: string }[] = [];
  @Input() noValidation: boolean = false;
  @Input() required: boolean = false;
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

  constructor(private utilityService: UtilityService) {}

  async ngOnInit() {
    this.timeZones = this.utilityService.checkSeason();
    this.id = this.utilityService.generateString(8);
    if (!this.value) {
      this.formValue = formatDate(new Date(), 'YYYY-MM-ddTHH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]);
      this.value = new Date(this.formValue).getTime();
    } else {
      this.formValue = formatDate(this.value, 'YYYY-MM-ddTHH:mm:ss', 'en_US', this.timeZones[this.timeZone as keyof typeof this.timeZones]);
    }
    this.selectDate(this.convertValueWithTimeZone(this.value));
    this.previousDisplayValue = this.displayValue;
    this.previousValue = this.formValue;
  }

  selectDate(value: Event | string | number) {
    console.log('before', this.formValue);
    this.formValue = typeof value === 'string' ? value : (value as CustomEvent).detail.value;
    console.log('after', this.formValue);
    switch (this.localType) {
      case 'date-time':
        this.displayValue = formatDate(this.formValue, "LLL d'th', yyyy hh:mm a", 'en_US');
        break;
      case 'date':
        this.displayValue = formatDate(this.formValue, "LLL d'th', yyyy", 'en_US');
        break;
      case 'time':
        this.displayValue = formatDate(this.formValue, 'hh:mm a', 'en_US');
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
    console.log(this.formValue);
    console.log(this.value);
    console.log(this.chosenTimeDifference);
    this.emitValue.emit(this.value + this.chosenTimeDifference); // always returns without timeZone
  }
}
