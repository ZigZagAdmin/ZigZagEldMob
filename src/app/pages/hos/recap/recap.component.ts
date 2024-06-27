import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recap',
  templateUrl: './recap.component.html',
  styleUrls: ['./recap.component.scss'],
})
export class RecapComponent implements OnInit {
  @Input() set recapTime(value: string) {
    this.time = value;
  }

  @Input() set recapDays(obj: { [key: string]: number }) {
    this._recapDays = obj;
  }
  @Input() set recapFooter(obj: { last7Days: number; hwt: number; hatomorrow: number; hatoday: number }) {
    this._recapFooter = obj;
  }

  time: string;
  _recapDays: { [key: string]: number };
  _recapFooter: { last7Days: number; hwt: number; hatomorrow: number; hatoday: number };
  isModalOpen: boolean = false;

  constructor() {}

  ngOnInit() {}

  open() {
    this.isModalOpen = true;
  }

  cancel() {
    this.isModalOpen = false;
  }

  formatDateL(oldDate: string) {
    return formatDate(new Date(oldDate), 'cccc, LLL d', 'en-US');
  }
}
