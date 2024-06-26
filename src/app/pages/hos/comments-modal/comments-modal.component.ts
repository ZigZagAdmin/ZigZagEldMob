import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ShareService } from 'src/app/services/share.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilityService } from 'src/app/services/utility.service';
import { suggestions } from 'src/app/utilities/suggestions';

@Component({
  selector: 'app-comments-modal',
  templateUrl: './comments-modal.component.html',
  styleUrls: ['./comments-modal.component.scss'],
})
export class CommentsModalComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() fill: boolean = false;
  @Input() disabled: boolean = false;
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

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() confirmModal: EventEmitter<void> = new EventEmitter<void>();

  valid: boolean = true;
  private _value: string = '';

  validateSubscription: Subscription;

  suggestions: { text: string; active: boolean }[] = suggestions.map(el => {
    return { text: el, active: false };
  });
  foundSuggestions: string[] = [];
  showTooltip: boolean = false;

  constructor(private toastService: ToastService, private shareService: ShareService, private translate: TranslateService, private utilityService: UtilityService) {}

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
    this.suggestions.forEach(el => (this.value.includes(el.text) ? (el.active = true) : (el.active = false)));
    // this.findSuggestions();
    this.valueChange.emit(this.value);
  }

  chooseWord(word: { text: string; active: boolean }) {
    this.valid = true;
    word.active = !word.active;
    if (word.active) {
      if (this.value.length === 0) this.value += word.text;
      else this.value += ', ' + word.text;
    } else {
      let index = this.value.indexOf(word.text);
      console.log(index);
      console.log(this.value);
      console.log(word.text);
      if (index - 2 <= 0)
        if (this.value.length === word.text.length) this.value = this.value.replace(word.text, '');
        else this.value = this.value.replace(word.text + ', ', '');
      else this.value = this.value.replace(', ' + word.text, '');
      console.log(this.value);
    }
  }

  cancel() {
    this.closeModal.emit();
  }

  confirm() {
    this.validateInput();
    if(!this.valid) return;
    this.confirmModal.emit();
  }

  completeWord(suggestion: string) {
    let separateValues = this.value.split(', ');
    separateValues[separateValues.length - 1] = suggestion;
    this.value = separateValues.join(', ') + ', ';
    document.getElementById('custom-textarea').focus();
    setTimeout(() => (this.showTooltip = false), 100);
  }

  validateInput() {
    if (!this.noValidation) {
      console.log(this.value);
      if (this.value === undefined || this.value === null || this.value.length === 0) {
        this.valid = false;
        this.toastService.showToast(this.translate.instant('Field required'));
      } else if (this.value.length > 0) {
        this.valid = true;
      }
      this.validation = this.valid;
    }
  }
}
