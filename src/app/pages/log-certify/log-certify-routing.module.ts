import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogCertifyPage } from './log-certify.page';

const routes: Routes = [
  {
    path: '',
    component: LogCertifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogCertifyPageRoutingModule {}
