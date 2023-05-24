import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserConstants } from 'src/app/constants/user-api.constant';
import { Direction } from 'src/app/models/direction';
import { Itinerary } from 'src/app/models/itinerary';
import { PlaylistRequest } from 'src/app/models/playlist';
import { Artist, SpotifyUser, Track, Vibe } from 'src/app/models/spotify-models';
import { EmailRequest, UserData } from 'src/app/models/user-data';
import { AuthService } from 'src/app/services/auth.service';
import { FormatTimeService } from 'src/app/services/format-time.service';
import { SaveDataService } from 'src/app/services/save-data.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { SpotifyGetUserService } from 'src/app/services/spotify-api.service';

@Component({
  selector: 'app-mat-user-save',
  templateUrl: './mat-user-save.component.html',
  styleUrls: ['./mat-user-save.component.css']
})
export class MatUserSaveComponent implements OnInit {

  createForm!: FormGroup
  artists!: Artist[]
  genres!: string[];
  spotifyUser!: SpotifyUser;
  playlistRequest!: PlaylistRequest;
  tracks!: Track[];
  vibe!: Vibe;
  userData!: UserData
  itinerary!: Itinerary
  playlistId = ''
  direction!: Direction
  itineraryId = ''
  username = ''

  isCreated: boolean = true
  created: boolean = false
  createdOn!: Date

  isEmail!: Boolean

  emailEligible!: Boolean


  constructor(public dialogRef: MatDialogRef<MatUserSaveComponent>,
    private fb: FormBuilder, private saveDataService: SaveDataService,
    private spotifyGetUserService: SpotifyGetUserService,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private authService: AuthService,
    private formatTimeService: FormatTimeService) { }

  ngOnInit(): void {
    this.artists = JSON.parse(sessionStorage.getItem('artists')!)
    this.genres = JSON.parse(sessionStorage.getItem('genres')!)
    this.spotifyUser = JSON.parse(sessionStorage.getItem('spotifyUser')!)
    this.playlistRequest = JSON.parse(sessionStorage.getItem('playlistRequest')!)
    this.tracks = JSON.parse(sessionStorage.getItem('tracks')!)
    this.vibe = JSON.parse(sessionStorage.getItem('vibe')!)
    this.direction = JSON.parse(sessionStorage.getItem('direction')!)
    this.username = JSON.parse(localStorage.getItem('auth-user')!).username

    this.createForm = this.fb.group({
      createOn: this.fb.control<number>(1, Validators.required),
      notifyMe: this.fb.control<boolean>(false, Validators.required)
    })

    if (new Date(this.direction.directionRequest.time).getTime() - new Date().getTime() <= 0) {
      this.emailEligible = false
    } else {
      this.emailEligible = true
    }

    this.saveDataService.getUserDetails(this.username).then(
      (data: any) => {
        // console.info(data)
        sessionStorage.setItem('userData', JSON.stringify(data))
      }
    )
  }

  goToItinerary() {
    this.sessionStorageService.clearForLoginUser()
    this.dialogRef.close()
    this.router.navigate(['/dashboard'], { queryParams: { 'id': this.itineraryId } })
  }

  postPlaylist(isEmail: Boolean) {
    this.saveDataService.checkIfSpotifyUserExists(this.username).then(
      (data: any) => {
        this.spotifyGetUserService.createPlaylist(this.playlistRequest).then(
          (data: any) => {
            // console.info(data)
            const playlistId = data.id
            sessionStorage.setItem('playlistId', playlistId)

            if (isEmail) {
              const emailRequest = this.createEmailBody()
              this.sendEmail(emailRequest)
            } 
            if (this.playlistRequest.imageData != '') {
              this.spotifyGetUserService.addImageToPlaylist(this.playlistRequest.imageData.split(',')[1], playlistId)
            }
            let songsArr = []
            let promiseArr = []
            // console.info(this.playlistRequest.songs)
            if (this.playlistRequest.songs.length > 100) {

              songsArr.push(this.playlistRequest.songs.slice(0, 100))
              songsArr.push(this.playlistRequest.songs.slice(100))
            }
            else {
              songsArr.push(this.playlistRequest.songs)
            }

            for (let s of songsArr) {
              promiseArr.push(this.spotifyGetUserService.addItemsToPlaylist(s, playlistId))
            }

            Promise.allSettled(promiseArr).then(
              (data: any) => {
                // console.info(data)
                this.itinerary = this.saveDataService.convertToItinerary(this.artists, this.vibe,
                  this.genres, this.tracks, this.direction, this.playlistRequest, true, new Date(), playlistId)
                sessionStorage.setItem('itinerary', JSON.stringify(this.itinerary))

                this.saveDataService.saveItinerary(this.itinerary).then(
                  (data: any) => {
                    // console.info(data['id'])
                    this.itineraryId = data['id']
                    this.created = true
                  }
                )
              }
            )
          }
        )
      }
    )
  }

  sendEmail(emailRequest: EmailRequest) {
    this.saveDataService.sendEmail(emailRequest).then(
      (data: any) => {
        // console.info(data)
      }
    )
  }

  createEmailBody() {

    this.direction = JSON.parse(sessionStorage.getItem('direction')!)
    // console.info(this.direction)
    const email = JSON.parse(sessionStorage.getItem('userData')!).email
    const firstName = JSON.parse(sessionStorage.getItem('userData')!).firstName
    const playlistId = sessionStorage.getItem('playlistId')!

    const subject = 'Auxtripper - Your Upcoming Trip Reminder'
    const body = `<p>Hi ${firstName}!</p>
                  <p>Your Spotify playlist for your trip from ${this.direction.directionRequest.origin.address}
                  to ${this.direction.directionRequest.destination.address} on the
                  ${this.direction.travelDate} is ready!</p>
                  <p>Please click <a href="https://open.spotify.com/playlist/${playlistId}">here</a> to view it now!</p>
                  <p>You can also log in to your <a href="${UserConstants.WEBSITE_URL}dashboard">dashboard</a> to view or modify your playlists!</p>
                  <p>Enjoy your trip!</p>
                  <p>Auxtripper</P>
                  `

    const dateTime = new Date(this.direction.directionRequest.time)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    let dateTimeToSend = this.formatTimeService.formatTimeForEmail(dateTime)

    let emailRequest: EmailRequest = {
      email: email,
      subject: subject,
      body: body,
      dateTime: dateTimeToSend,
      timeZone: timeZone
    }

    return emailRequest
  }
}
