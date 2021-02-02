import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, Route, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import * as fromRoot from '../app.reducer';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private router: Router, private store: Store<fromRoot.State>) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['login']);
    // }
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }

  canLoad(route: Route): boolean | Promise<boolean> | Observable<boolean> {
    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['login']);
    // }
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));

  }
}
