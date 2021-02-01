
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth'

import { User } from './user.model';
import { AuthData } from './auth-data.model';


@Injectable({ providedIn: 'root' })
export class AuthService {

  authChange = new Subject<boolean>();
  private user: User;
  private isAuthenticated: boolean = false;
  constructor(private router: Router, private afAuth: AngularFireAuth) { }

  registerUser(authData: AuthData) {
    this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
      console.log(result);
      this.authSuccessfully();
    }).catch(error => {
      console.log(error);
    })

  }

  login(authData: AuthData) {
    this.afAuth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      console.log(result);
      this.authSuccessfully();
    }).catch(error => {
      console.log(error);
    })

  }

  logout() {
    this.afAuth.signOut();
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
  }

  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
