import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface DutyStatusItem {
  color: string;
  label: string;
  value: string;
  checked: boolean;
}
@Component({
  selector: 'app-duty-radio-button',
  templateUrl: './duty-radio-button.component.html',
  styleUrls: ['./duty-radio-button.component.scss'],
})
export class DutyRadioButtonComponent implements OnInit {
  data: DutyStatusItem[] = [
    { color: 'var(--gray-300)', label: 'Off Duty', value: 'OFF', checked: false },
    { color: 'var(--primary-800)', label: 'Sleeper Berth', value: 'SB', checked: false },
    { color: 'var(--success-500)', label: 'On Duty', value: 'ON', checked: false },
    { color: 'var(--warning-500)', label: 'Driving', value: 'D', checked: false },
    { color: '#AF5FFE', label: 'Personal Conveyance', value: 'PC', checked: false },
    { color: 'var(--error-500)', label: 'Yard Moves', value: 'YM', checked: false },
  ];

  // @Input() currentValue: string = '';

  @Output() selectedValue: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {
    // if(this.currentValue.length !== 0) {
    //   let item = this.data.find(el => el.value === this.currentValue);
    //   this.select(item);
    // }
  }

  select(item: DutyStatusItem) {
    let index = this.data.findIndex(el => el.value === item.value);
    this.data.forEach(el => (el.checked = false));
    this.data[index].checked = true;
    this.selectedValue.emit(this.data[index].value);
  }
}
