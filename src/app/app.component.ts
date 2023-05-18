import { Component } from '@angular/core';
import { AndroidPermissions } from "@awesome-cordova-plugins/android-permissions/ngx";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private androidPermissions: AndroidPermissions) {}
}
