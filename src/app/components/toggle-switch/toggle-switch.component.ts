import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
})
export class ToggleSwitchComponent implements OnInit {
  @Input() isChecked: boolean = false;

  @Output() checkedCallback: EventEmitter<void> = new EventEmitter<void>();
  @Output() uncheckedCallback: EventEmitter<void> = new EventEmitter<void>();
  @Output() valueCalback: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  onCheckboxChange() {
    if (this.isChecked) this.checkedCallback.emit();
    else this.uncheckedCallback.emit();
    this.valueCalback.emit(this.isChecked);
  }
}
