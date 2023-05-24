import { Injectable } from '@angular/core';
import { Artist, SaveSpotifyUserRequest, SpotifyUser, Track, Vibe } from '../models/spotify-models';
import { Direction } from '../models/direction';
import { Itinerary } from '../models/itinerary';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { UserConstants } from '../constants/user-api.constant';
import { PlaylistRequest, Playlist, ModifyPlaylistRequest } from '../models/playlist';
import { EmailRequest, UserData } from '../models/user-data';

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {

  headers = new HttpHeaders()
    .set("Content-Type", 'application/json')
    // .set('Access-Control-Allow-Origin', 'http://localhost:4200')
    .set('Access-Control-Allow-Credentials', 'true')
    .set('Access-Control-Allow-Methods', '*')

  constructor(private http: HttpClient) { }

  convertToItinerary(artists: Artist[], vibe: Vibe,
    genres: string[], tracks: Track[], direction: Direction, playlistRequest: PlaylistRequest,
    isCreated: boolean, createdOn: Date, playlistId: string) {

    let playlist: Playlist = {
      playlistId: playlistId,
      playlistRequest: playlistRequest,
      artists: artists,
      tracks: tracks,
      genres: genres,
      isCreated: isCreated,
      createdOn: createdOn,
      vibe: vibe
    }

    const itinerary: Itinerary = {
      direction: direction,
      playlist: playlist
    }
    return itinerary
  }

  convertToUserData(spotifyUser: SpotifyUser) {
    let userData: UserData = {
      spotifyUser: spotifyUser
    }
    return userData
  }

  saveItinerary(saveObj: Itinerary) {
    return lastValueFrom(this.http.post(UserConstants.ITINERARY_SAVE, JSON.stringify(saveObj), { headers: this.headers }))
  }

  saveUserData(userData: UserData) {
    return lastValueFrom(this.http.post(UserConstants.USER_DATA_SAVE, JSON.stringify(userData), { headers: this.headers }))
  }

  saveSpotifyUser(spotifyUser: SaveSpotifyUserRequest) {
    console.info(JSON.stringify(spotifyUser))
    return lastValueFrom(this.http.post(UserConstants.SPOTIFY_USER_SAVE, JSON.stringify(spotifyUser), { headers: this.headers}))
  }

  checkIfSpotifyUserExists(username: string) {
    const params = new HttpParams().append('username', username)
    return firstValueFrom(this.http.get(UserConstants.SPOTIFY_USER_EXISTS, { headers: this.headers, params : params }))
  }

  getSpotifyUser(username: string) {
    const params = new HttpParams().append('username', username)
    return firstValueFrom(this.http.get(UserConstants.GET_SPOTIFY_USER, { headers: this.headers, params : params }))
  }

  getAllUserItineraries(username: string) {
    const params = new HttpParams().append('username', username)
    return firstValueFrom(this.http.get(UserConstants.GET_USER_ITINERARIES, { headers: this.headers, params : params }))
  }

  getUserItineraryById(itineraryId: string) {
    const params = new HttpParams().append('id', itineraryId)
    return firstValueFrom(this.http.get(UserConstants.GET_ITINERARY_BY_ID, { headers: this.headers, params : params }))
  }

  deleteItineraryById(itineraryId: string) {
    const params = new HttpParams().append('id', itineraryId)
    return firstValueFrom(this.http.get(UserConstants.DELETE_ITINERARY_BY_ID, { headers: this.headers, params : params }))

  }

  modifyPlaylist(modifyPlaylistRequest: ModifyPlaylistRequest) {
    return lastValueFrom(this.http.post(UserConstants.MODIFY_PLAYLIST_REQUEST, JSON.stringify(modifyPlaylistRequest), { headers: this.headers}))
  }

  updateRefreshToken(username: string, token: string) {
    let refreshToken: any = {
      username: username,
      refreshToken: token
    }
    // console.info(refreshToken)
    return lastValueFrom(this.http.post(UserConstants.UPDATE_REFRESH_TOKEN, JSON.stringify(refreshToken), { headers: this.headers}))
  }

  sendEmail(emailRequest: EmailRequest) {

    return lastValueFrom(this.http.post(UserConstants.SEND_EMAIL, JSON.stringify(emailRequest), { headers: this.headers }))

  }

  getUserDetails(username: string) {
    const params = new HttpParams().append('username', username)
    return lastValueFrom(this.http.get(UserConstants.GET_USER_EMAIL, { params, headers: this.headers }))
  }

}
