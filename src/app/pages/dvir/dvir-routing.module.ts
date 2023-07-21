import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DvirPage } from './dvir.page';

const routes: Routes = [
  {
    path: '',
    component: DvirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DvirPageRoutingModule {}
