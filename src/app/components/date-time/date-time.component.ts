import { formatDate } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
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
  @Input() set type(_type: string) {
    this.localType = _type;
    if (this.localType !== 'date-time') {
      this.enableWheel = true;
    }
  }

  @Output() changeDetection: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  get value(): string {
    return this._value;
  }

  @Output() valueChange = new EventEmitter<string>();

  set value(newValue: string) {
    console.log(newValue);
    if (this._value !== newValue) {
      this._value = newValue;
      this.valueChange.emit(newValue);
    }
  }

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
  private _value: string;

  isModalOpen: boolean = false;

  id: string = '';

  localType: string = 'date-time';
  enableWheel: boolean = false;

  displayValue: string = '';

  previousValue: string = '';
  previousDisplayValue: string = '';

  constructor(private utilityService: UtilityService) {}

  ngOnInit() {
    this.id = this.utilityService.generateString(8);
    if (!this.value) {
      this.selectDate(formatDate(new Date(), 'YYYY-MM-ddTHH:mm:ss', 'en_US'));
    }
  }

  selectDate(value: Event | string) {
    this.value = typeof value === 'string' ? value : (value as CustomEvent).detail.value;
    switch (this.localType) {
      case 'date-time':
        this.displayValue = formatDate(this.value, "LLL d'th', yyyy hh:mm a", 'en_US');
        break;
      case 'date':
        this.displayValue = formatDate(this.value, "LLL d'th', yyyy", 'en_US');
        break;
      case 'time':
        this.displayValue = formatDate(this.value, 'hh:mm a', 'en_US');
        break;
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.value = this.previousValue;
    this.displayValue = this.previousDisplayValue;
  }

  submit() {
    this.isModalOpen = false;
    this.previousValue = this.value;
    this.previousDisplayValue = this.displayValue;
  }
}
