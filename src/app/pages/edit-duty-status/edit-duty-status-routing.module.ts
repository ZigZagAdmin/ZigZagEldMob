import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDutyStatusPage } from './edit-duty-status.page';

const routes: Routes = [
  {
    path: '',
    component: EditDutyStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDutyStatusPageRoutingModule {}
