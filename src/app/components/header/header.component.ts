import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title: string;
  @Input() subtitle: string;

  @Input() backButton: boolean = false;

  @Output() backButtonCallback: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  goBack() {
    this.backButtonCallback.emit();
  }

  getPlatform() {
    return Capacitor.getPlatform();
  }
}
