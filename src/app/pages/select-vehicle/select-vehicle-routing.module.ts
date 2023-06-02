import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectVehiclePage } from './select-vehicle.page';

const routes: Routes = [
  {
    path: '',
    component: SelectVehiclePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectVehiclePageRoutingModule {}
