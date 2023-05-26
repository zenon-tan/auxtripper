import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { SpotifyConstants } from 'src/app/constants/spotify-api.constant'
import { PkceCodeService } from './pkce-code.service';
import { Environment } from '../env/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthService {

  constructor(private http: HttpClient, 
    private pkceCodeService: PkceCodeService) { }

  codeVerifier: string  = ''


  getSpotifyUserLogin() {

    this.codeVerifier = this.pkceCodeService.generateRandomString(128)
  
    this.pkceCodeService.generateCodeChallenge(this.codeVerifier).then(
      (codeChallenge: string) => {
        let state = this.pkceCodeService.generateRandomString(16)

        console.info(SpotifyConstants.REDIRECT_URL)

        localStorage.setItem('code_verifier', this.codeVerifier)

        let args = new URLSearchParams({
          response_type: 'code',
          client_id: Environment.SPOTIFY_CLIENT_ID,
          scope: SpotifyConstants.SCOPE,
          redirect_uri: SpotifyConstants.REDIRECT_URL,
          state: state,
          code_challenge_method: 'S256',
          code_challenge: codeChallenge
        });

        window.location.href = SpotifyConstants.SPOTIFY_AUTHORIZE + args

      }
      )
  }

  authorizeSpotify(code: string, codeVerifier: string) {

    let body = new HttpParams()
    .set('grant_type', 'authorization_code')
    .set('code', code)
    .set('redirect_uri', SpotifyConstants.REDIRECT_URL)
    .set('client_id', Environment.SPOTIFY_CLIENT_ID)
    .set('code_verifier', codeVerifier)

    let headers = new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded')

    return lastValueFrom(this.http.post(SpotifyConstants.SPOTIFY_TOKEN, body.toString(), { headers: headers }))

  }

  refreshSpotify(refreshToken: string) {

    let body = new HttpParams()
    .set('grant_type', 'refresh_token')
    .set('refresh_token', refreshToken)
    .set('client_id', Environment.SPOTIFY_CLIENT_ID)

    let headers = new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded')

    return lastValueFrom(this.http.post(SpotifyConstants.SPOTIFY_TOKEN, body.toString(), { headers: headers }))

  }

}
