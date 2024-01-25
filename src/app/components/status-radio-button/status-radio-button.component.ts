import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface StatusItem {
  icon: 'success' | 'error';
  label: string;
  value: string;
  checked: boolean;
}

@Component({
  selector: 'app-status-radio-button',
  templateUrl: './status-radio-button.component.html',
  styleUrls: ['./status-radio-button.component.scss'],
})
export class StatusRadioButtonComponent implements OnInit {
  data: StatusItem[] = [
    { icon: 'success', label: 'Vehicle Condition Satisfactory', value: 'VCS', checked: false },
    { icon: 'error', label: 'Has Defects', value: 'D', checked: false },
    { icon: 'success', label: 'Defects Corrected', value: 'DC', checked: false },
    { icon: 'error', label: 'Defects Need Not Be Corrected', value: 'DNNBC', checked: false },
  ];

  dataHalf: StatusItem[] = [
    { icon: 'success', label: 'Vehicle Condition Satisfactory', value: 'VCS', checked: false },
    { icon: 'error', label: 'Has Defects', value: 'D', checked: false },
  ];

  @Input() half: boolean = false;
  @Input() disableOption: boolean = false;

  @Output() selectedValue: EventEmitter<string> = new EventEmitter<string>();

  private _value: string;

  @Input()
  get value(): string {
    return this._value;
  }

  @Output() valueChange = new EventEmitter<string>();

  set value(newValue: string) {
    // console.log(newValue);
    if (this._value !== newValue) {
      this._value = newValue;
      this.changeCurrentValue();
      this.valueChange.emit(newValue);
    }
  }

  constructor() {}

  ngOnInit() {
    this.changeCurrentValue();
  }

  changeCurrentValue() {
    if (this._value.length !== 0) {
      let item = this.data.find(el => el.value === this._value);
      this.select(item);
    }
  }

  select(item: StatusItem) {
    let index = this.data.findIndex(el => el.value === item.value);
    let data: StatusItem[] = [];
    if (this.half) {
      data = this.dataHalf;
    } else {
      data = this.data;
    }
    data.forEach(el => (el.checked = false));
    data[index].checked = true;
    this.selectedValue.emit(data[index].value);
  }
}
