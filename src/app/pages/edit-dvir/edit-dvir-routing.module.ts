import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDvirPage } from './edit-dvir.page';

const routes: Routes = [
  {
    path: '',
    component: EditDvirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDvirPageRoutingModule {}
