import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ShareService } from 'src/app/services/share.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilityService } from 'src/app/services/utility.service';
import { suggestions } from 'src/app/utilities/suggestions';

@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss'],
})
export class LocationModalComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() fill: boolean = false;
  @Input() disabled: boolean = false;

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

  @Output() submitModal: EventEmitter<void> = new EventEmitter<void>();

  private _value: string = '';

  suggestions: { text: string; active: boolean }[] = suggestions.map(el => {
    return { text: el, active: false };
  });
  foundSuggestions: string[] = [];
  showTooltip: boolean = false;

  constructor(private toastService: ToastService, private shareService: ShareService, private translate: TranslateService, private utilityService: UtilityService) {}

  ngOnInit() {
    
  }

  ngOnDestroy(): void {
  }

  onInputChange(event: any) {
    this.value = event.target.value;
    this.valueChange.emit(this.value);
  }

  submit() {
    this.submitModal.emit();
  }

}
