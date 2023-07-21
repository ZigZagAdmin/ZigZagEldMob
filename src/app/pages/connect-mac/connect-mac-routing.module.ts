import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectMacPage } from './connect-mac.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectMacPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectMacPageRoutingModule {}
