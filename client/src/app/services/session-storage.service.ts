import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  clearTempObjects() {
    sessionStorage.removeItem('_temp-locked-tracks')
    sessionStorage.removeItem('_temp-display-tracks')
  }

  clearTripObjects() {
    sessionStorage.removeItem('tripDisplay')
    sessionStorage.removeItem('direction')
  }

  clearSpotifyObjects() {
    sessionStorage.removeItem('artists')
    sessionStorage.removeItem('vibe')
    sessionStorage.removeItem('tracks')
    sessionStorage.removeItem('genres')
    sessionStorage.removeItem('playlistRequest')
    sessionStorage.removeItem('playlist')
  }

  clearItinerary() {
    sessionStorage.removeItem('itinerary')
  }

  clearSpotifyUser() {
    sessionStorage.removeItem('spotifyUser')
  }

  clearForNonUser() {
    sessionStorage.clear()
  }

  clearUserDataForEmail() {
    sessionStorage.removeItem('userEmail')
    sessionStorage.removeItem('userData')
  }

  clearPlaylistId() {
    sessionStorage.removeItem('playlistId')
  }

  clearForLoginUser() {
    this.clearTempObjects()
    this.clearTripObjects()
    this.clearSpotifyObjects()
    this.clearItinerary()
    this.clearUserDataForEmail()
    this.clearPlaylistId()
  }
}
