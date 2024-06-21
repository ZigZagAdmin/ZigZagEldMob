import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface IStatus {
  statusName: string;
  statusCode: string;
  icon: string;
  background: string;
  backgroundLayer: string;
  color: string;
  label: boolean;
  labelCode?: string;
  labelColor?: string;
  labelBackground?: string;
}

@Component({
  selector: 'app-current-status',
  templateUrl: './current-status.component.html',
  styleUrls: ['./current-status.component.scss'],
})
export class CurrentStatusComponent implements OnInit {
  @Input() set status(value: string) {
    this.currentStatus = this.statusList.find(el => el.statusCode === value);
    this.changeDetectorRef.detectChanges();
  }
  @Input() time: string;

  @Output() statusCallback: EventEmitter<string> = new EventEmitter<string>();

  statusList: IStatus[] = [
    { statusName: 'Driving', statusCode: 'D', icon: 'assets/icons/d-icon.svg', background: 'var(--success-500)', backgroundLayer: 'var(--gray-500)', color: 'var(--gray-25)', label: false },
    {
      statusName: 'Sleeper Berth',
      statusCode: 'SB',
      icon: 'assets/icons/sb-icon.svg',
      background: 'var(--gray-700)',
      backgroundLayer: 'var(--gray-300)',
      color: 'var(--gray-25)',
      label: false,
    },
    {
      statusName: 'On Duty',
      statusCode: 'ON',
      icon: 'assets/icons/on-icon.svg',
      background: 'var(--warning-500)',
      backgroundLayer: 'var(--gray-300)',
      color: 'var(--gray-25)',
      label: true,
      labelCode: 'YM',
      labelColor: 'var(--warning-500)',
      labelBackground: 'var(--gray-25)',
    },
    {
      statusName: 'Yard Moves',
      statusCode: 'YM',
      icon: 'assets/icons/ym-icon.svg',
      background: 'var(--warning-200)',
      color: 'var(--warning-500)',
      backgroundLayer: 'var(--warning-500)',
      label: true,
      labelCode: 'ON',
      labelColor: 'var(--gray-25)',
      labelBackground: 'var(--warning-500)',
    },
    {
      statusName: 'Off Duty',
      statusCode: 'OFF',
      icon: 'assets/icons/off-icon.svg',
      background: 'var(--gray-400)',
      backgroundLayer: 'var(--gray-300)',
      color: 'var(--gray-25)',
      label: true,
      labelCode: 'PC',
      labelColor: 'var(--gray-400)',
      labelBackground: 'var(--gray-25)',
    },
    {
      statusName: 'PC',
      statusCode: 'PC',
      icon: 'assets/icons/pc-icon.svg',
      background: 'var(--gray-200)',
      color: 'var(--gray-400)',
      backgroundLayer: 'var(--gray-500)',
      label: true,
      labelCode: 'OFF',
      labelColor: 'var(--gray-25)',
      labelBackground: 'var(--gray-400)',
    },
  ];

  currentStatus: IStatus;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {}

  changeStatus(code: string) {
    this.statusCallback.emit(code);
  }
}
