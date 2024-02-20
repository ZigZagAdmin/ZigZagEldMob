import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-scroll-toolbar',
  templateUrl: './scroll-toolbar.component.html',
  styleUrls: ['./scroll-toolbar.component.scss'],
})
export class ScrollToolbarComponent implements OnInit {
  @Input() title: string | null;

  @Output() leftCallback: EventEmitter<void> = new EventEmitter<void>();
  @Output() rightCallback: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  left() {
    this.leftCallback.emit();
  }

  right() {
    this.rightCallback.emit();
  }
}
