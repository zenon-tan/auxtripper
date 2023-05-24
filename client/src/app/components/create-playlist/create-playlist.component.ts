import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Direction } from 'src/app/models/direction';
import { Itinerary } from 'src/app/models/itinerary';
import { PlaylistRequest } from 'src/app/models/playlist';
import { Artist, SpotifyUser, Track, Vibe } from 'src/app/models/spotify-models';
import { UserData } from 'src/app/models/user-data';
import { SaveDataService } from 'src/app/services/save-data.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { SpotifyGetUserService } from 'src/app/services/spotify-api.service';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.css']
})
export class CreatePlaylistComponent implements OnInit {

  direction!: Direction
  selectedArtists: string[] = []
  selectedArtistsId: string[] = []
  selectedGenres: any[] = []
  vibe!: Vibe
  artists: Artist[] = []
  tracks: Track[] = []
  trackIds: string[] = []
  spotifyUser!: SpotifyUser
  playlistRequest!: PlaylistRequest
  playlistUrl = ''
  playlistId = ''
  itinerary!: Itinerary
  userData!: UserData


  constructor(private router: Router,
    private saveDataService: SaveDataService,
    private spotifyGetUserService: SpotifyGetUserService,
    private sessionStorageService: SessionStorageService) { }

  ngOnInit(): void {
    if (JSON.parse(sessionStorage.getItem('direction')!) != null) {
      this.direction = JSON.parse(sessionStorage.getItem('direction')!)
    } else {
      this.router.navigate(['/'])
    }

    if (JSON.parse(sessionStorage.getItem('artists')!) != null
      || JSON.parse(sessionStorage.getItem('genres')!) != null
      || JSON.parse(sessionStorage.getItem('spotifyUser')!) != null
      || JSON.parse(sessionStorage.getItem('tracks')!) != null
      || JSON.parse(sessionStorage.getItem('vibe')!) != null) {
      this.artists = JSON.parse(sessionStorage.getItem('artists')!)
      this.selectedGenres = JSON.parse(sessionStorage.getItem('genres')!)
      this.spotifyUser = JSON.parse(sessionStorage.getItem('spotifyUser')!)
      this.playlistRequest = JSON.parse(sessionStorage.getItem('playlistRequest')!)
      this.tracks = JSON.parse(sessionStorage.getItem('tracks')!)
      this.vibe = JSON.parse(sessionStorage.getItem('vibe')!)
    } else {
      this.router.navigate(['/'])
    }

    for (let t of this.tracks) {
      this.trackIds.push(t.uri)
    }
  }

  save() {

    this.userData = this.saveDataService.convertToUserData(this.spotifyUser)

    this.itinerary = this.saveDataService.convertToItinerary(this.artists, this.vibe,
      this.selectedGenres, this.tracks, this.direction, this.playlistRequest, true, new Date(), this.playlistId)
    sessionStorage.setItem('itinerary', JSON.stringify(this.itinerary))
    this.router.navigate(['/login'])
  }

  skip() {
    this.spotifyGetUserService.createPlaylist(this.playlistRequest).then(
      (data: any) => {
        this.playlistUrl = data.url
        this.playlistId = this.playlistUrl.split('playlist/')[1]
        console.info(this.playlistId)
        sessionStorage.setItem('playlist', JSON.stringify({ id: this.playlistId, url: this.playlistUrl }))
        this.router.navigate(['/playlist', this.playlistId])
      }
    )
    this.sessionStorageService.clearForNonUser()
  }
}
