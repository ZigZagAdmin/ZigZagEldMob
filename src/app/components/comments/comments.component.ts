import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, Renderer2, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShareService } from 'src/app/services/share.service';
import { ToastService } from 'src/app/services/toast.service';
import { suggestions } from 'src/app/utilities/suggestions';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit, OnDestroy {
  @Input() label: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() fill: boolean = true;
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

  valid: boolean = true;
  private _value: string;

  validateSubscription: Subscription;

  suggestions: string[] = suggestions;
  foundSuggestions: string[] = [];
  showTooltip: boolean = false;

  constructor(private toastService: ToastService, private shareService: ShareService, private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.validateSubscription = this.shareService.currentMessage.subscribe(data => {
      if (data === 'reset') {
        this.valid = true;
      } else {
        if (data && data.length !== 0) this.validateInput();
      }
    });
  }

  calculatePosition() {
    const element = this.el.nativeElement.querySelector('#custom-tooltip');
    console.log(window.innerWidth);
    console.log(element.offsetWidth);
    if (element) {
      this.renderer.setStyle(element, 'left', (window.innerWidth - element.offsetWidth - 40) / 2 + 'px');
    }
  }

  ngOnDestroy(): void {
    this.validateSubscription.unsubscribe();
  }

  onInputChange(event: any) {
    if (event.target.value !== 0) this.valid = true;
    this.value = event.target.value;
    this.findSuggestions();
    this.valueChange.emit(this.value);
  }

  findSuggestions() {
    this.foundSuggestions = [];
    let separateValues = this.value.split(' ');
    let lastValue = separateValues[separateValues.length - 1];
    if (lastValue.length >= 2) {
      this.suggestions.forEach(suggestion => {
        if (suggestion.toLocaleLowerCase().includes(lastValue.toLocaleLowerCase())) {
          if (suggestion.toLocaleLowerCase() !== lastValue.toLocaleLowerCase()) {
            this.foundSuggestions.push(suggestion);
          }
        }
      });
    }
    if (this.foundSuggestions.length !== 0) {
      this.showTooltip = true;
      setTimeout(() => this.calculatePosition(), 0);
    } else {
      this.showTooltip = false;
    }
  }

  completeWord(suggestion: string) {
    let separateValues = this.value.split(' ');
    separateValues[separateValues.length - 1] = suggestion;
    this.value = separateValues.join(' ') + ' ';
    document.getElementById('custom-textarea').focus();
    setTimeout(() => (this.showTooltip = false), 100);
  }

  validateInput() {
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
      this.validation = this.valid;
    }
  }
}
