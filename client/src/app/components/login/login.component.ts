import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationRequest } from 'src/app/models/authentication-models';
import { SpotifyUser } from 'src/app/models/spotify-models';
import { AuthStorageService } from 'src/app/services/auth-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup
  req!: AuthenticationRequest
  isLoggedIn!: boolean;
  isLoginFailed = false;
  roles: string[] = []
  status = ''
  redirectUrl = ''
  spotifyUser!: SpotifyUser
  isSuccessful: Boolean = false

  errorMessage = 'Incorrect username or password'


  constructor(private fb:FormBuilder, private authService: AuthService,
    private authStorageService: AuthStorageService, private router: Router,
    private activatedRoute: ActivatedRoute,
    private sessionStorageService: SessionStorageService
    ) {}

    ngOnInit(): void {

      if(localStorage.getItem('auth-user') != null) {
        if(this.authStorageService.isLoggedIn()) {
          this.router.navigate(['/dashboard'])
        }
      }

      if(this.activatedRoute.snapshot.queryParams['status'] != undefined) {
        this.status = this.activatedRoute.snapshot.queryParams['status']
        console.info(this.status)
      }

      if (this.activatedRoute.snapshot.queryParams['redirectUrl'] != undefined) {
        this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectUrl']
      }

      this.loginForm = this.fb.group({
        loginUsername: this.fb.control<string>('', [Validators.required]),
        loginPassword: this.fb.control<string>('', [Validators.required])
      })
    }

    onSubmitLogin() {
      const {loginUsername, loginPassword} = this.loginForm.value
      this.authService.login(loginUsername, loginPassword).then(
        (data:any) => {
          this.authStorageService.saveUser(data)
          this.authService.emitLoginStatus(true)
          this.authService.isLoggedIn = true
          this.roles = this.authStorageService.getUser().roles
          this.isLoginFailed = false

          if(this.redirectUrl != '') {
            this.router.navigateByUrl(this.redirectUrl)
          }
          else {
            this.router.navigate(['/dashboard'])
          }
        }
      ).catch(
        (e) => {
          console.info(e)
          this.isLoginFailed = true
        }
      )
    }
    
    toRegister() {
      this.router.navigate(['/signup'])
    }

}
