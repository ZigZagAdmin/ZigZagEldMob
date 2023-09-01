import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InsertDutyStatusPage } from './insert-duty-status.page';

const routes: Routes = [
  {
    path: '',
    component: InsertDutyStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsertDutyStatusPageRoutingModule {}
