import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'loader',
    loadChildren: () =>
      import('./pages/loader/loader.module').then((m) => m.LoaderPageModule),
  },
  {
    path: 'select-vehicle',
    loadChildren: () =>
      import('./pages/select-vehicle/select-vehicle.module').then(
        (m) => m.SelectVehiclePageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'connect-mac',
    loadChildren: () =>
      import('./pages/connect-mac/connect-mac.module').then(
        (m) => m.ConnectMacPageModule
      ),
    canActivate: [AuthGuard],
  },  {
    path: 'hos',
    loadChildren: () => import('./pages/hos/hos.module').then( m => m.HosPageModule)
  },
  {
    path: 'dvir',
    loadChildren: () => import('./pages/dvir/dvir.module').then( m => m.DvirPageModule)
  },
  {
    path: 'inspection',
    loadChildren: () => import('./pages/inspection/inspection.module').then( m => m.InspectionPageModule)
  },
  {
    path: 'others',
    loadChildren: () => import('./pages/others/others.module').then( m => m.OthersPageModule)
  },
  {
    path: 'unitab',
    loadChildren: () => import('./pages/unitab/unitab.module').then( m => m.UnitabPageModule)
  },
  {
    path: 'co-driver',
    loadChildren: () => import('./pages/co-driver/co-driver.module').then( m => m.CoDriverPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'rules',
    loadChildren: () => import('./pages/rules/rules.module').then( m => m.RulesPageModule)
  },
  {
    path: 'information',
    loadChildren: () => import('./pages/information/information.module').then( m => m.InformationPageModule)
  },
  {
    path: 'send-logs',
    loadChildren: () => import('./pages/send-logs/send-logs.module').then( m => m.SendLogsPageModule)
  },
  {
    path: 'inspection-preview',
    loadChildren: () => import('./pages/inspection-preview/inspection-preview.module').then( m => m.InspectionPreviewPageModule)
  },
  {
    path: 'user-manual',
    loadChildren: () => import('./pages/user-manual/user-manual.module').then( m => m.UserManualPageModule)
  },
  {
    path: 'instructions',
    loadChildren: () => import('./pages/instructions/instructions.module').then( m => m.InstructionsPageModule)
  },
  {
    path: 'insert-dvir',
    loadChildren: () => import('./pages/insert-dvir/insert-dvir.module').then( m => m.InsertDvirPageModule)
  },
  {
    path: 'edit-dvir',
    loadChildren: () => import('./pages/edit-dvir/edit-dvir.module').then( m => m.EditDvirPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
