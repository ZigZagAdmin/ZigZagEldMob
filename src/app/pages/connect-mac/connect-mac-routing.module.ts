import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectMacPage } from './connect-mac.page';
import { LeaveGuard } from 'src/app/guards/leave.guard';

const routes: Routes = [
  {
    path: '',
    component: ConnectMacPage,
    canDeactivate: [LeaveGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectMacPageRoutingModule {}
