import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationRequest } from 'src/app/models/authentication-models';
import { SpotifyUser } from 'src/app/models/spotify-models';
import { AuthStorageService } from 'src/app/services/auth-storage.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registrationForm!: FormGroup
  req!: AuthenticationRequest
  isLoggedIn = false;
  isLoginFailed = false;
  roles: string[] = []

  status = ''
  redirectUrl = ''

  spotifyUser!: SpotifyUser


  isSuccessful: Boolean = false
  isSignUpFailed: Boolean = false

  constructor(private fb: FormBuilder, private authService: AuthService,
    private authStorageService: AuthStorageService, private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    if (localStorage.getItem('auth-user') != null) {
      if (this.authStorageService.isLoggedIn()) {
        this.router.navigate(['/dashboard'])
      }
    }

    this.registrationForm = this.fb.group({
      firstName: this.fb.control<string>('', [Validators.required]),
      lastName: this.fb.control<string>('', [Validators.required]),
      username: this.fb.control<string>('', [Validators.required]),
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required])
    })

    if (this.activatedRoute.snapshot.queryParams['status'] != undefined) {
      this.status = this.activatedRoute.snapshot.queryParams['status']
    }

    if (this.activatedRoute.snapshot.queryParams['redirectUrl'] != undefined) {
      this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectUrl']
    }

    this.registrationForm = this.fb.group({
      firstName: this.fb.control<string>('', [Validators.required]),
      lastName: this.fb.control<string>('', [Validators.required]),
      username: this.fb.control<string>('', [Validators.required]),
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required])
    })


  }

  onSubmitRegistration() {
    const { firstName, lastName, username, email, password } = this.registrationForm.value
    this.authService.register(firstName, lastName, email, username, password).then(
      (data: any) => {
        this.isSuccessful = true
        this.isSignUpFailed = false
        if (this.redirectUrl != '') {
          this.router.navigate(['/login'],
            {
              queryParams: {
                'status': 'sign up success',
                'redirectUrl': this.redirectUrl
              }
            })
        } else {
          this.router.navigate(['/login'],
            {
              queryParams: {
                'status': 'sign up success'
              }
            })

        }
      }
    ).catch(
      (error: any) => {
        this.isSignUpFailed = true
      }
    )
  }

  toRegister() {
    this.router.navigate(['/login'])
  }

}
