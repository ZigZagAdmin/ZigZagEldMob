import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogItemPage } from './log-item.page';

const routes: Routes = [
  {
    path: '',
    component: LogItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogItemPageRoutingModule {}
