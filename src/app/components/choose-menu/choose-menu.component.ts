import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShareService } from 'src/app/services/share.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-choose-menu',
  templateUrl: './choose-menu.component.html',
  styleUrls: ['./choose-menu.component.scss'],
})
export class ChooseMenuComponent  implements OnInit {
  @Input() trigger: string = 'something';
  @Input() isModalOpen: boolean = false;
  @Input() options: string[];

  @Output() changeDetection: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  get value(): string {
    return this._value;
  }

  @Output() valueChange = new EventEmitter<string>();

  set value(newValue: string) {
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

  optionsCheck: { value: string; checked: boolean }[] = [];
  lastStatus: { value: string; checked: boolean }[] = [];

  validationSub: Subscription;

  constructor(private utilityService: UtilityService, private toastService: ToastService, private shareService: ShareService) {}

  ngOnInit() {
    this.optionsCheck = this.options.map(value => ({ value: value, checked: false }));
    if (this._value && this._value.length !== 0) {
      const localArray = this._value.split(', ');
      this.optionsCheck.forEach(option => localArray.forEach(valueSent => (option.value === valueSent ? (option.checked = true) : null)));
    }
    this.lastStatus = this.cloneArray(this.optionsCheck);
  }

  ngOnDestroy(): void {
    this.validationSub.unsubscribe();
  }

  triggerCheck(option: { value: string; checked: boolean }, index: number) {
    this.optionsCheck.forEach(el => (el.checked = false));
    const el = this.optionsCheck.find(el => el.value === option.value);
    if (el.checked) {
      el.checked = false;
    } else {
      el.checked = true;
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.optionsCheck = this.cloneArray(this.lastStatus);
  }

  submit() {
    let chosenElements: string[] = [];
    this.optionsCheck.forEach(el => (el.checked === true ? chosenElements.push(el.value) : null));
    this.value = chosenElements.join(', ');
    this.lastStatus = this.cloneArray(this.optionsCheck);
    this.isModalOpen = false;
  }

  cloneArray(array: any) {
    return JSON.parse(JSON.stringify(array));
  }
}
