import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InspectionPreviewPage } from './inspection-preview.page';

const routes: Routes = [
  {
    path: '',
    component: InspectionPreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InspectionPreviewPageRoutingModule {}
