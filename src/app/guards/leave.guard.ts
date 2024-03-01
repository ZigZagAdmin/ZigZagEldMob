import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ConnectMacPage } from '../pages/connect-mac/connect-mac.page';
import { HosPage } from '../pages/hos/hos.page';

@Injectable({
  providedIn: 'root',
})
export class LeaveGuard implements CanDeactivate<ConnectMacPage | HosPage> {
  canDeactivate(
    component: ConnectMacPage | HosPage,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log('leave guard: ', component);
    return component && component.canDeactivate ? component.canDeactivate() : true;
  }
}
