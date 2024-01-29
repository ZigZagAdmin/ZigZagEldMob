import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShareService } from 'src/app/services/share.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class TextareaComponent implements OnInit {
  @Input() label: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() fill: boolean = true;
  @Input() validators: { regex: RegExp; message: string }[] = [];
  @Input() noValidation: boolean = false;

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

  constructor(private toastService: ToastService, private shareService: ShareService) {}

  ngOnInit() {
    this.validateSubscription = this.shareService.currentMessage.subscribe(data => {
      if(data === 'reset') {
        this.valid = true;
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
    // console.log(this.value);
    // console.log(!this.value && this.value.length === 0);
    if (!this.noValidation) {
      if (this.value.length === 0) {
        this.valid = false;
        this.toastService.showToast('Field required');
        // return;
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
      console.log(this.valid);
      this.validation = this.valid;
    }
  }
}
