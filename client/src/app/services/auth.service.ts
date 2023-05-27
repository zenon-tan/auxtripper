import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { RegisterRequest, AuthenticationRequest } from '../models/authentication-models';
import { UserConstants } from '../constants/user-api.constant';


const AUTH_API = UserConstants.AUTH_API

const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json',
'Access-Control-Allow-Credentials': 'true'
// , 'Access-Control-Allow-Origin': 'http://localhost:4200'
})}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private authEvent = new BehaviorSubject<boolean>(false)
  isLoggedIn = false

  req!: RegisterRequest
  auth!: AuthenticationRequest

  constructor(private http : HttpClient) { }

  login(username: string, password: string) {

    this.auth = {
      username: username,
      password: password,
      role: 'USER'
    }
  
    return firstValueFrom(this.http.post(AUTH_API + 'authenticate', JSON.stringify(this.auth), httpOptions))
  }

  register(firstName: string, lastName: string, email: string, username: string, password: string) {

    this.req = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: password,
      role: 'USER'
    }

    return firstValueFrom(this.http.post(AUTH_API + 'register', JSON.stringify(this.req), httpOptions))

  }

  emitLoginStatus(state: boolean) {
    return this.authEvent.next(state)
  }

  LoginListener() {
    return this.authEvent.asObservable()
  }

  getCurrentUser() {
    return firstValueFrom(this.http.get(UserConstants.GET_CURRENT_USER))
  }

  checkUsername(username: string) {
    const params = new HttpParams()
    .append('username', username)
    return firstValueFrom(this.http.get(AUTH_API + 'checkUsername', {params}))
  }

  checkEmail(email: string) {
    const params = new HttpParams()
    .append('email', email)
    return firstValueFrom(this.http.get(AUTH_API + 'checkEmail', {params}))
  }
}
