import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, delay, mergeMap, retry, retryWhen, take, tap, throwError, timer } from "rxjs";
import { AuthStorageService } from "../services/auth-storage.service";
import { SpotifyConstants } from "../constants/spotify-api.constant";
import { SaveDataService } from "../services/save-data.service";
import { SpotifyUser } from "../models/spotify-models";
import { SpotifyAuthService } from "../services/spotify-auth.service";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { MatDialog } from "@angular/material/dialog";

@Injectable()
export class HttpRequestInterceptor {

    currentUser!: string
    username!: string
    spotifyUser!: SpotifyUser

    isTokenRefreshed!: Boolean

    redirectUrl!: string
    // redirectUrlParams!: string

    constructor(private authStorageService: AuthStorageService,
        private saveDataService: SaveDataService,
        private spotifyAuthService: SpotifyAuthService,
        private authService: AuthService,
        private router: Router,
        private matDialog: MatDialog) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const spotifyApi = SpotifyConstants.SPOTIFY_API_URL
        const spotifyToken = SpotifyConstants.SPOTIFY_TOKEN
        const itineraryApi = '/itinerary/api'
        const userDataApi = '/userData/api'

        if (req.url.search(itineraryApi) >= 0 || req.url.search(userDataApi) >= 0) {

            if(this.router.routerState.snapshot.url !== '/connect-spotify') {
                console.info('not connect spotify')
                this.redirectUrl = this.router.routerState.snapshot.url
            }

            console.info(this.redirectUrl)
            if (JSON.parse(localStorage.getItem('auth-user')!) != undefined) {
                req = req.clone({
                    withCredentials: true,
                    setHeaders: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('auth-user')!).token }
                })

                return next.handle(req).pipe(
                    catchError((error: HttpErrorResponse) => {
                        if (error.status === 401 || error.status === 500) {
                            console.info('error 401')
                            localStorage.removeItem('auth-user')
                            this.authService.emitLoginStatus(false)
                            this.matDialog.closeAll()
                            this.router.navigate(['/login'], { queryParams: { 'status': 'expired', 'redirectUrl': this.router.routerState.snapshot.url } })
                        }
                        return throwError(error)
                    })
                )

            } else {
                console.info('not logged in')
                this.router.navigate(['/login'], { queryParams: { 'status': 'unathorized' } })
                return next.handle(req)
            }
        }
        if (req.url.search(spotifyApi) >= 0) {
       
            if (JSON.parse(localStorage.getItem('auth-user')!) != null) {

                return next.handle(req).pipe(
                    retryWhen(errors => {
        
                        return errors
                          .pipe(
                            mergeMap(error=>error.status === 400 ? timer(1000) : throwError(error)),
                            take(3)
                          )
            
                      }),
                    catchError((error: HttpErrorResponse) => {
                        console.info('error: ' + this.redirectUrl)
                        if (error.status === 401) {
                            this.username = this.authStorageService.getUser().username
                      
                            console.info('logged in and with spotify')
                            this.saveDataService.checkIfSpotifyUserExists(this.username).then(
                                (exists: any) => {
                                    if (exists) {
                                        this.saveDataService.getSpotifyUser(this.username).then(
                                            (data: any) => {
                                                console.info(data)
                                                this.spotifyAuthService.refreshSpotify(data.refreshToken).then(
                                                    (newData: any) => {
                                                        // console.info(newData)
                                                        console.info("token refreshed")
                                                        localStorage.setItem('access_token', newData.access_token)
                                                        localStorage.setItem('refresh_token', newData.refresh_token)
                                                        this.saveDataService.updateRefreshToken(this.username, newData.refresh_token).then(
                                                            (isSaved: any) => {
                                                                if (isSaved == true) {
                                                                    console.info("token updated in db")
                                                                }
                                                            }
                                                        )
                                                    }
                                                )


                                            }
                                        )
                                    }
                                }
                            )
                        } if(error.status === 400) {
                            window.location.reload()
                        }

                        return throwError(error)
                    })
                )
            }
        }
        if (req.url.search(spotifyToken) >= 0) {
            console.info(this.redirectUrl)
            if (JSON.parse(localStorage.getItem('auth-user')!) != null) {
                console.info('spotifyapi')
                return next.handle(req).pipe(
                    catchError((error: HttpErrorResponse) => {
                            this.router.navigate(['/connect-spotify'], {queryParams: {'redirectUrl': this.redirectUrl}})
                        return throwError(error)
                    })
                )

            }

        }
        return next.handle(req)

    }
}

export const httpInterceptorProvider = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
]