import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IStatus } from '../current-status/current-status.component';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss'],
})
export class ChangeStatusComponent implements OnInit {
  statusList: IStatus[] = [
    { statusName: 'Driving', statusCode: 'D', icon: 'assets/icons/d-icon.svg', background: 'var(--success-500)', backgroundLayer: 'assets/icons/s-d-bg.svg', color: 'var(--gray-25)', label: false },
    {
      statusName: 'Sleeper',
      statusCode: 'SB',
      icon: 'assets/icons/sb-icon.svg',
      background: 'var(--gray-700)',
      backgroundLayer: 'assets/icons/s-sb-bg.svg',
      color: 'var(--gray-25)',
      label: false,
    },
    {
      statusName: 'On Duty',
      statusCode: 'ON',
      icon: 'assets/icons/on-icon.svg',
      background: 'var(--warning-500)',
      backgroundLayer: 'assets/icons/s-on-bg.svg',
      color: 'var(--gray-25)',
      label: true,
      labelCode: 'YM',
      labelColor: 'var(--warning-500)',
      labelBackground: 'var(--gray-25)',
    },
    {
      statusName: 'Off Duty',
      statusCode: 'OFF',
      icon: 'assets/icons/off-icon.svg',
      background: 'var(--gray-400)',
      backgroundLayer: 'assets/icons/s-off-bg.svg',
      color: 'var(--gray-25)',
      label: true,
      labelCode: 'PC',
      labelColor: 'var(--gray-400)',
      labelBackground: 'var(--gray-25)',
    },
  ];

  @Input()
  get status(): string {
    return this.currentStatus.statusCode;
  }

  @Output() statusChange = new EventEmitter<string>();

  set status(value: string) {
    console.log(value);
    this.currentStatus = this.statusList.find(el => el.statusCode === value);
    this.filteredList = this.statusList.filter(el => el.statusCode !== value && el.labelCode !== value);
    this.statusChange.emit(value);
    this.changeDetectorRef.detectChanges();
  }

  @Output() statusCallback: EventEmitter<void> = new EventEmitter<void>();

  currentStatus: IStatus;
  filteredList: IStatus[];

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {}

  triggerStatus(code: string) {
    this.status = code;
    this.statusChange.emit(code);
  }
}
