import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ShareService } from 'src/app/services/share.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit, OnDestroy {
  @Input() label: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() fill: boolean = true;
  @Input() validators: { regex: RegExp; message: string }[] = [];
  @Input() noValidation: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showDisabled: boolean = false;
  @Input() required: boolean = false;
  @Input() labelPosition: 'top' | 'left' = 'top';

  @Input()
  get value(): string {
    return this._value;
  }

  @Output() valueChange = new EventEmitter<string>();

  set value(newValue: string) {
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

  validateSubscription: Subscription;

  constructor(private toastService: ToastService, private shareService: ShareService, private elementRef: ElementRef, private translate: TranslateService) {}

  ngOnInit() {
    this.validateSubscription = this.shareService.currentMessage.subscribe(data => {
      if (data === 'reset') {
        this.valid = true;
      } else if (data === 'invalidate' && !this.noValidation) {
        this.valid = false;
      } else {
        if (data && data.length !== 0) this.validateInput();
      }
    });
  }

  ngOnDestroy(): void {
    this.validateSubscription.unsubscribe();
  }

  onInputChange(event: any) {
    if (event.target.value !== 0) this.valid = true;
    this.value = event.target.value;
    this.valueChange.emit(this.value);
  }

  validateInput() {
    if (!this.noValidation && this.elementRef.nativeElement.offsetParent !== null) {
      if (this.value.length === 0) {
        this.valid = false;
        this.toastService.showToast(this.translate.instant('Field required'));
      } else if (this.value.length > 0) {
        this.valid = true;
      }
      if (this.value.length >= 0 && this.validators.length !== 0) {
        this.validators.every(validator => {
          if (!validator.regex.test(this.value)) {
            this.valid = true;
            this.toastService.showToast(validator.message);
            return false;
          }
          return true;
        });
      }
      this.validation = this.valid;
    }
  }
}
