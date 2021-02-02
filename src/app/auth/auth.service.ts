
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store'

import { TrainingService } from '../training/training.service';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from '../auth/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // authChange = new Subject<boolean>();
  private user: User;
  private isAuthenticated: boolean = false;
  constructor(private router: Router, private afAuth: AngularFireAuth,
    private trainingService: TrainingService, private snackBar: MatSnackBar,
    // private uiService: UIService,
    private store: Store<fromRoot.State>) { }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    // this.store.dispatch({ type: 'START_LOADING' });
    this.store.dispatch(new UI.StartLoading());

    this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
      console.log(result);
      // this.uiService.loadingStateChanged.next(false);
      // this.store.dispatch({ type: 'STOP_LOADING' });
      this.store.dispatch(new UI.StopLoading());


    }).catch(error => {
      // console.log(error);
      // this.uiService.loadingStateChanged.next(false);
      // this.store.dispatch({ type: 'STOP_LOADING' });
      this.store.dispatch(new UI.StopLoading());


      this.snackBar.open(error.message, null, {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    })

  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // this.isAuthenticated = true;
        // this.authChange.next(true);
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        // this.isAuthenticated = false;
        // this.authChange.next(false);
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/login']);

      }
    });
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    // this.store.dispatch({ type: 'START_LOADING' });
    this.store.dispatch(new UI.StartLoading());

    this.afAuth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      console.log(result);
      // this.uiService.loadingStateChanged.next(false);
      // this.store.dispatch({ type: 'STOP_LOADING' });
      this.store.dispatch(new UI.StopLoading());

    }).catch(error => {
      // console.log(error);
      // this.uiService.loadingStateChanged.next(false);
      // this.store.dispatch({ type: 'STOP_LOADING' });
      this.store.dispatch(new UI.StopLoading());

      this.snackBar.open(error.message, null, {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    })

  }

  logout() {
    this.afAuth.signOut();
  }

  // isAuth() {
  //   return this.isAuthenticated;
  // }

}
