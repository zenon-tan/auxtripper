import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStorageService } from './services/auth-storage.service';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { SessionStorageService } from './services/session-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client'
  isLoggedIn$!: Subscription
  isLoggedIn = false
  username = ''

  constructor(private router: Router,
    private authStorageService: AuthStorageService,
    private authService: AuthService,
    private sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
       this.isLoggedIn = this.authService.isLoggedIn;
       this.username = this.authStorageService.getUser().username
      } else if (this.authStorageService.isLoggedIn()) {
        this.isLoggedIn = true
      }
    }) 
  }

  login() {
    this.router.navigate(['/login'])
  }

  goToHome() {
    this.router.navigate(['/'])
  }

  newTrip() {
    this.router.navigate(['/'])
  }

  viewDashboard() {
    this.router.navigate(['/dashboard'])
  }

  logout() {
    this.sessionStorageService.logout()
    this.authService.isLoggedIn = false
    this.isLoggedIn = false
    this.router.navigate(['/login'])
  }
}
