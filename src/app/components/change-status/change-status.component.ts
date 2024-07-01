import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IStatus } from '../current-status/current-status.component';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss'],
})
export class ChangeStatusComponent implements OnInit, OnChanges {
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
    console.log(this.manualTrigger);
    this.tempValue = value;
    if (!this.manualTrigger) {
      this.filterData(value);
    }
  }

  @Input() filterTrigger: boolean = undefined;
  @Output() statusCallback: EventEmitter<void> = new EventEmitter<void>();

  currentStatus: IStatus;
  filteredList: IStatus[];
  manualTrigger: boolean = false;
  previousValue: string = '';
  tempValue: string = '';

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.currentStatus && changes['filterTrigger'] && changes['filterTrigger'].previousValue !== undefined && changes['filterTrigger'].previousValue !== null) {
      this.filterData(this.tempValue);
    }
  }

  triggerStatus(code: string) {
    this.manualTrigger = true;
    this.status = code;
    console.log(code);
    console.log(this.status);
    this.statusChange.emit(code);
  }

  filterData(value: string) {
    console.log(value);
    if (this.manualTrigger) this.manualTrigger = false;
    if (this.currentStatus === undefined || value !== this.previousValue) {
      this.currentStatus = this.statusList.find(el => el.statusCode === value);
      this.filteredList = this.statusList.filter(el => el.statusCode !== value && el.labelCode !== value);
      this.previousValue = value;
      console.log(this.previousValue);
      this.changeDetectorRef.detectChanges();
    }
  }
}
