import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogItemPage } from './log-item.page';
import { LogItemDailyComponent } from './log-item-daily/log-item-daily.component';

const routes: Routes = [
  {
    path: '',
    component: LogItemPage,
  },
  {
    path: ':id', component: LogItemDailyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogItemPageRoutingModule {}
