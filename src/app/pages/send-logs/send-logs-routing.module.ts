import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendLogsPage } from './send-logs.page';

const routes: Routes = [
  {
    path: '',
    component: SendLogsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendLogsPageRoutingModule {}
