import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SaveSpotifyUserRequest, SpotifyUser } from 'src/app/models/spotify-models';
import { AuthStorageService } from 'src/app/services/auth-storage.service';
import { SaveDataService } from 'src/app/services/save-data.service';
import { SpotifyGetUserService } from 'src/app/services/spotify-api.service';
import { SpotifyAuthService } from 'src/app/services/spotify-auth.service';
import { SpotifyObjectService } from 'src/app/services/spotify-object.service';

@Component({
  selector: 'app-auth-success',
  templateUrl: './auth-success.component.html',
  styleUrls: ['./auth-success.component.css']
})
export class AuthSuccessComponent {

  username = ''
  spotifyUser!: SpotifyUser

  constructor(private spotifyAuthService: SpotifyAuthService,
    private spotifyGetUserService: SpotifyGetUserService,
    private saveDataService: SaveDataService,
    private authStorageService: AuthStorageService,
    private spotifyObjectService: SpotifyObjectService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient) { }

  ngOnInit(): void {

    const code = this.activatedRoute.snapshot.queryParams["code"]
    console.info(code)

    let codeVerifier = localStorage.getItem('code_verifier')!

    this.spotifyAuthService.authorizeSpotify(code, codeVerifier)
      .then(
        (data: any) => {

          localStorage.setItem('access_token', data.access_token)

          this.spotifyGetUserService.getSpotifyCurrentUser().then(
            (user: any) => {
              this.spotifyUser = this.spotifyObjectService.convertToUser(user)
              sessionStorage.setItem('spotifyUser', JSON.stringify(this.spotifyUser))
              console.info(this.spotifyUser)

              if (this.authStorageService.isLoggedIn()) {
                this.username = JSON.parse(localStorage.getItem('auth-user')!).username

                localStorage.setItem('refresh_token', data.refresh_token)
                this.saveDataService.checkIfSpotifyUserExists(this.username).then(
                  (exists: any) => {

                    if (exists == false) {
                      const saveSpotifyUser: SaveSpotifyUserRequest = {
                        spotifyUser: this.spotifyUser,
                        username: this.username,
                        refreshToken: localStorage.getItem('refresh_token')!
                      }

                      this.saveDataService.saveSpotifyUser(saveSpotifyUser).then(
                        (data: any) => {
                          console.info(data)
                        }
                      )
                    }
                    this.router.navigate(['/playlist/new'])
                  }
                ).catch(
                  (e) => {
                    console.info(e)
                  }
                )

              }
              this.spotifyGetUserService.getSpotifyCurrentUser().then(
                (data:any) => {
                  this.spotifyUser = this.spotifyObjectService.convertToUser(data)
                  sessionStorage.setItem('spotifyUser', JSON.stringify(this.spotifyUser))
                  this.router.navigate(['/playlist/new'])
                }
              )
              // this.router.navigate(['/playlist/new'])
            }
          )
          // this.router.navigate(['/playlist/new'])
        }
      )
  }
}
