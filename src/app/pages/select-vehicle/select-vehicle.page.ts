import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-vehicle',
  templateUrl: './select-vehicle.page.html',
  styleUrls: ['./select-vehicle.page.scss'],
})
export class SelectVehiclePage implements OnInit {
  constructor(private route: Router) {}

  ngOnInit() {}

  selectVehicle() {
    this.route.navigate(['/connect-mac']);
  }
}
