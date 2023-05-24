import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthenticationRequest } from 'src/app/models/authentication-models';
import { PlaylistRequest } from 'src/app/models/playlist';
import { AuthStorageService } from 'src/app/services/auth-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { SpotifyGetUserService } from 'src/app/services/spotify-api.service';

@Component({
  selector: 'app-login-mat',
  templateUrl: './login-mat.component.html',
  styleUrls: ['./login-mat.component.css']
})
export class LoginMatComponent implements OnInit {

  loginForm!: FormGroup
  registrationForm!: FormGroup
  req!: AuthenticationRequest
  // isLoggedIn = false;
  isLoginFailed = false;
  roles: string[] = []
  playlistRequest!: PlaylistRequest
  playlistUrl = ''
  playlistId = ''

  errorMessage = 'Incorrect username or password'



  constructor(private fb:FormBuilder, private authService: AuthService, 
    private authStorageService: AuthStorageService, private router: Router,
    public dialogRef: MatDialogRef<LoginMatComponent>,
    private spotifyGetUserService: SpotifyGetUserService,
    private sessionStorageService: SessionStorageService) {

      this.loginForm = this.fb.group({
        loginUsername: this.fb.control<string>('', [Validators.required]),
        loginPassword: this.fb.control<string>('', [Validators.required])
      })

    }

  ngOnInit(): void {
    this.playlistRequest = JSON.parse(sessionStorage.getItem('playlistRequest')!)
  }

  onSubmitLogin() {
    const {loginUsername, loginPassword} = this.loginForm.value
    this.authService.login(loginUsername, loginPassword).then(
      (data:any) => {
        console.info(data)
        this.authStorageService.saveUser(data)
        this.isLoginFailed = false
        this.roles = this.authStorageService.getUser().roles
        window.location.reload()
      }
    ).catch(
      (e) => {
        console.info(e)
        this.isLoginFailed = true
      }
    )
  }
  
  toRegister() {
    this.dialogRef.close()
    this.router.navigate(['/signup'], {queryParams: {'redirectUrl': this.router.routerState.snapshot.url}})
  }

  skip() {

    this.spotifyGetUserService.createPlaylist(this.playlistRequest).then(
      (data:any) => {
        const playlistId = data.id
        if(this.playlistRequest.imageData != '') {
          this.spotifyGetUserService.addImageToPlaylist(this.playlistRequest.imageData.split(',')[1], playlistId)
        }
        let songsArr = []
        let promiseArr = []
        console.info(this.playlistRequest.songs)
        if(this.playlistRequest.songs.length > 100) {
          songsArr.push(this.playlistRequest.songs.slice(0, 100))
          songsArr.push(this.playlistRequest.songs.slice(100))
        }
        else {
          songsArr.push(this.playlistRequest.songs)
        }
        for(let s of songsArr) {
          promiseArr.push(this.spotifyGetUserService.addItemsToPlaylist(s, playlistId))
        }
        Promise.allSettled(promiseArr).then(
          (data: any) => {
            console.info(data)
            this.dialogRef.close()
            this.router.navigate(['/playlist', playlistId])
          }
        )
      }
    ).catch(
      (e) => {
        console.info(e)
        // Open error window
      }
    )
  }
}
