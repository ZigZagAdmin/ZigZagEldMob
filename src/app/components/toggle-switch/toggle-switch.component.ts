import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
})
export class ToggleSwitchComponent implements OnInit {
  @Output() checkedCallback: EventEmitter<void> = new EventEmitter<void>();
  @Output() uncheckedCallback: EventEmitter<void> = new EventEmitter<void>();

  isChecked: boolean = false;

  constructor() {}

  ngOnInit() {}

  onCheckboxChange() {
    if (this.isChecked) this.checkedCallback.emit();
    else this.uncheckedCallback.emit();
  }
}
