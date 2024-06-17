import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface DutyStatusItem {
  color: string;
  label: string;
  value: string;
  icon: string;
  iconActive: string;
  checked: boolean;
}

@Component({
  selector: 'app-refined-duty-radio-button',
  templateUrl: './refined-duty-radio-button.component.html',
  styleUrls: ['./refined-duty-radio-button.component.scss'],
})
export class RefinedDutyRadioButtonComponent  implements OnInit {
  data: DutyStatusItem[] = [
    { color: 'var(--warning-400)', icon: "assets/icons/truck-new-gray.svg", iconActive: "assets/icons/truck-new-white.svg", label: 'On Duty', value: 'ON', checked: false },
    { color: 'var(--split-spleeper-berth)', icon: "assets/icons/sleep-gray.svg", iconActive: "assets/icons/sleep-white.svg", label: 'SB', value: 'SB', checked: false },
    { color: 'var(--off-duty)', icon: "assets/icons/power-button-gray.svg", iconActive: "assets/icons/power-button-white.svg", label: 'Off Duty', value: 'OFF', checked: false },
    { color: 'var(--success-500)', icon: "assets/icons/driving-gray.svg", iconActive: "assets/icons/driving-white.svg", label: 'Driving', value: 'D', checked: false },
    { color: 'var(--warning-400)', icon: "assets/icons/feed-gray.svg", iconActive: "assets/icons/feed-white.svg", label: 'Yard Moves', value: 'YM', checked: false },
    { color: 'var(--off-duty)', icon: "assets/icons/person-gray.svg", iconActive: "assets/icons/person-white.svg", label: 'PC', value: 'PC', checked: false },
  ];
  
  @Input() set _currentValue(value: string) {
    this.currentValue = value;
    console.log(this.currentValue);
    if (this.currentValue.length !== 0 && this.currentValue !== this.lastValue) {
      let item = this.data.find(el => el.value === this.currentValue);
      this.select(item);
    }
  }

  currentValue: string = '';
  lastValue: string = '';

  @Input() disable: boolean = false;
  @Input() showDisabled: boolean = false;

  @Output() selectedValue: EventEmitter<string> = new EventEmitter<string>();

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    
  }

  select(item: DutyStatusItem) {
    console.log("Pressed: ", item);
    let index = this.data.findIndex(el => el.value === item.value);
    this.data.forEach(el => (el.checked = false));
    this.data[index].checked = true;
    this.selectedValue.emit(this.data[index].value);
    this.lastValue = this.data[index].value;
    this.changeDetectorRef.detectChanges();
  }

}
