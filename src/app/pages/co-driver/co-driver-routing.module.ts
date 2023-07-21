import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoDriverPage } from './co-driver.page';

const routes: Routes = [
  {
    path: '',
    component: CoDriverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoDriverPageRoutingModule {}
