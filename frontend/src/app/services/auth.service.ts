import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken: string;
  private userId: string;
  private name: string;
  private isAdmin: boolean;

  constructor(private http: HttpClient,
    private router: Router) { }

  createUser(name: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/auth/signup', { name: name, password: password }).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getToken() {
    if (this.authToken) {
      this.isAuth$.next(true);
      return this.authToken;
    } else {
      this.authToken = sessionStorage.getItem('TOKEN');
      if (this.authToken) {
        this.isAuth$.next(true);
      } else {
        this.isAuth$.next(false);
      }
      return this.authToken;
    }
  }

  getUserId() {
    if (this.userId) {
      return this.userId;
    } else {
      this.userId = sessionStorage.getItem('USER_ID');
      return this.userId;
    }
  }

  getName() {
    if (this.name) {
      return this.name;
    } else {
      this.name = sessionStorage.getItem('NAME');
      return this.name;
    }
  }

  getIsAdmin() {
    if (this.isAdmin) {
      return this.isAdmin;
    } else {
      this.isAdmin = sessionStorage.getItem('IS_ADMIN') === '1';
      return this.isAdmin;
    }
  }

  loginUser(name: string, password) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/auth/login', { name: name, password: password }).subscribe(
        (response: { userId: string, token: string, name: string, isAdmin: boolean }) => {
          this.userId = response.userId;
          this.authToken = response.token;
          this.name = response.name;
          this.isAdmin = response.isAdmin;
          sessionStorage.setItem('TOKEN', this.authToken);
          sessionStorage.setItem('USER_ID', this.userId);
          sessionStorage.setItem('NAME', this.name);
          sessionStorage.setItem('IS_ADMIN', String(this.isAdmin));
          this.isAuth$.next(true);
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  modifyUser(user: any, accountId: string) {
    return new Promise((resolve, reject) => {
      this.http.put('http://localhost:3000/api/auth/' + accountId, user).subscribe(
        (response: { message: string }) => {
          this.name = user.name;
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  deleteUser(accountId: string) {
    return new Promise((resolve, reject) => {
      this.http.delete('http://localhost:3000/api/auth/delete-user/' + accountId).subscribe(
        (response: any) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  logout() {
    this.authToken = null;
    sessionStorage.removeItem('TOKEN');
    sessionStorage.removeItem('USER_ID');
    sessionStorage.removeItem('NAME');
    sessionStorage.removeItem('IS_ADMIN');
    this.userId = null;
    this.isAuth$.next(false);
    this.router.navigate(['login']);
  }

}
