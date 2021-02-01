
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrainingService } from '../training/training.service';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { UIService } from '../shared/ui.service';


@Injectable({ providedIn: 'root' })
export class AuthService {

  authChange = new Subject<boolean>();
  private user: User;
  private isAuthenticated: boolean = false; D
  constructor(private router: Router, private afAuth: AngularFireAuth,
    private trainingService: TrainingService, private snackBar: MatSnackBar,
    private uiService: UIService) { }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);

    this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
      console.log(result);
      this.uiService.loadingStateChanged.next(false);

    }).catch(error => {
      // console.log(error);
      this.uiService.loadingStateChanged.next(false);

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
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      console.log(result);
      this.uiService.loadingStateChanged.next(false);
    }).catch(error => {
      // console.log(error);
      this.uiService.loadingStateChanged.next(false);
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

  isAuth() {
    return this.isAuthenticated;
  }

}
