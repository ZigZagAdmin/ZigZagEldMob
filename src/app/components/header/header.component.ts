import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';

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

  constructor(private platform: Platform) {}

  ngOnInit() {}

  goBack() {
    this.backButtonCallback.emit();
  }

  getPlatform() {
    return Capacitor.getPlatform();
  }

  getOrientation() {
    return this.platform.isLandscape();
  }
}
