import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HosPage } from './hos.page';
import { LeaveGuard } from 'src/app/guards/leave.guard';

const routes: Routes = [
  {
    path: '',
    component: HosPage,
    canDeactivate: [LeaveGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HosPageRoutingModule {}
