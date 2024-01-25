import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  @Input() label: string;
  @Input() fill: boolean = true;
  @Input() validators: { regex: RegExp; message: string }[] = [];
  @Input() noValidation: boolean = false;
  @Input() required: boolean = false;
  @Input() labelPosition: 'top' | 'left' = 'top';
  @Input() options: string[];

  @Output() changeDetection: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  get value(): string {
    return this._value;
  }

  @Output() valueChange = new EventEmitter<string>();

  set value(newValue: string) {
    // console.log(newValue);
    if (this._value !== newValue) {
      this._value = newValue;
      this.valueChange.emit(newValue);
      this.changeDetection.emit(newValue);
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

  validateSubscription: Subscription;
  constructor() {}

  ngOnInit() {}
}
