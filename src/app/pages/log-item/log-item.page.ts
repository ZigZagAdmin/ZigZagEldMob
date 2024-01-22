import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { InternetService } from 'src/app/services/internet.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Subscription, forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { LogDailies } from 'src/app/models/log-dailies';
import { LogEvents } from 'src/app/models/log-histories';
import { EventGraphic } from 'src/app/models/event-graphic';
import { Storage } from '@ionic/storage';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import SignaturePad from 'signature_pad';
import { NavController } from '@ionic/angular';
import { UtilityService } from 'src/app/services/utility.service';
import { ShareService } from 'src/app/services/share.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-log-item',
  templateUrl: './log-item.page.html',
  styleUrls: ['./log-item.page.scss'],
})
export class LogItemPage implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
