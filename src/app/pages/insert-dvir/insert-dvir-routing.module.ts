import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InsertDvirPage } from './insert-dvir.page';

const routes: Routes = [
  {
    path: '',
    component: InsertDvirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsertDvirPageRoutingModule {}
