import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnitabPage } from './unitab.page';
import { DvirPageModule } from '../dvir/dvir.module';
import { DvirPage } from '../dvir/dvir.page';

const routes: Routes = [
  {
    path: '',
    component: UnitabPage,
    children: [
      {
        path: 'hos',
        loadChildren: () =>
          import('../hos/hos.module').then((m) => m.HosPageModule),
      },
      {
        path: 'dvir',
        component: DvirPage,
      },
      {
        path: 'inspection',
        loadChildren: () =>
          import('../inspection/inspection.module').then(
            (m) => m.InspectionPageModule
          ),
      },
      {
        path: 'others',
        loadChildren: () =>
          import('../others/others.module').then((m) => m.OthersPageModule),
      },
      {
        path: '',
        redirectTo: '/unitab/hos',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/unitab/hos',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnitabPageRoutingModule {}
