import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user'

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  constructor() {}

  clean() {
    window.sessionStorage.clear()
  }

  public saveUser(user: any) {
    localStorage.removeItem(USER_KEY)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  public getUser() {
    const user = localStorage.getItem(USER_KEY)
    if(user) {
      return JSON.parse(user)
    }
    return {}
  }

  public isLoggedIn() {
    const user = localStorage.getItem(USER_KEY)
    if(user) {
      return true
    }
    return false
  }


}
