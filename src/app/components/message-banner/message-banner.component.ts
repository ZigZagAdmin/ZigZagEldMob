import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-message-banner',
  templateUrl: './message-banner.component.html',
  styleUrls: ['./message-banner.component.scss'],
})
export class MessageBannerComponent  implements OnInit {

  @Input() type: 'success' | 'error' | 'warning' | 'default' = 'default';
  @Input() title: string;
  @Input() subtitle: string;
  @Input() close: boolean = false;

  @Output() closeCallback: EventEmitter<void> = new EventEmitter<void>();
 
  constructor() { }

  ngOnInit() {}

}
