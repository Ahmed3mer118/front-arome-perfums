import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import {
  ILogin,
  ILoginResponse,
  ITokenData,
  IRegister,
  setUser,
} from '../../interfaces/interface.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}
  private URL = environment.apiUrl;
  TOKEN_KEY = 'token';
  private user = new BehaviorSubject<ITokenData | null>(null);
  public user$ = this.user.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());

  login(loginData: ILogin): Observable<ILoginResponse> {
    return this._http
      .post<ILoginResponse>(this.URL + '/auth/login', loginData)
      .pipe(
        tap((res) => {
          this.setToken(res.data.token);
          this.user.next(this.decoded(res.data.token));
        })
      );
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSubject.next(token);
  }
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  

  decoded(token: string) {
    return jwtDecode<ITokenData>(token);
  }

  getRole(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      return this.decoded(token).role;
    }
    return null;
  }

  getName(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      return this.decoded(token).full_name;
    }
    return null;
  }
  getUserId(){
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      return this.decoded(token).user_id;
    }
    return null;
  }



  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.tokenSubject.next(null);
    this.user.next(null);
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getTokenObservable() {
    return this.tokenSubject.asObservable();
  }

  register(registerData: IRegister): Observable<any> {
    return this._http.post(`${this.URL}/auth/register`, registerData);
  }
}

