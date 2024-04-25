import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShareService } from 'src/app/services/share.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-choose-menu',
  templateUrl: './choose-menu.component.html',
  styleUrls: ['./choose-menu.component.scss'],
})
export class ChooseMenuComponent implements OnInit {
  @Input() trigger: string = 'something';
  @Input() isModalOpen: boolean = false;
  @Input() set options(value: string[]) {
    console.log(value);
    this._options = value;
  }
  @Input() noOptionsText: string = 'No options.';

  @Output() selectedValue: EventEmitter<string> = new EventEmitter<string>();
  @Output() closeCallback: EventEmitter<void> = new EventEmitter<void>();

  lastStatus: { value: string; checked: boolean }[] = [];
  _options: string[] = [];

  constructor(private utilityService: UtilityService, private toastService: ToastService, private shareService: ShareService) {}

  ngOnInit() {}

  ngOnDestroy(): void {}

  openModal() {
    this.isModalOpen = true;
  }

  choose(option: string) {
    this.selectedValue.emit(option);
  }

  closeModal() {
    this.isModalOpen = false;
    this.closeCallback.emit();
  }

  submit() {
    this.isModalOpen = false;
  }
}
