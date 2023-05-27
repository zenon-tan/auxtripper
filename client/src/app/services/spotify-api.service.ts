import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { SpotifyConstants } from 'src/app/constants/spotify-api.constant';
import { PlaylistRequest, ModifyPlaylistRequest } from '../models/playlist';

@Injectable({
  providedIn: 'root'
})
export class SpotifyGetUserService {

  getSpotifyCurrentUser() {
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    return firstValueFrom(this.http.get(SpotifyConstants.ME_URL, { headers }))
  }

  constructor(private http: HttpClient) { }

  getSpotifyTopArtists(time_range: string = SpotifyConstants.SPOTIFY_TIME_RANGE_MEDIUM.value,
    limit: number, offset: number = 0) {
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + localStorage.getItem('access_token'))

    const params = new HttpParams()
      .append('time_range', time_range)
      .append('limit', limit)
      .append('offset', offset)

    return this.http.get(SpotifyConstants.GET_TOP_ARTISTS, { headers: headers, params: params })
  }

  getRelatedArtists(artistId: string) {

    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + localStorage.getItem('access_token'))

    const params = new HttpParams()
      .append('artistId', artistId)

    return firstValueFrom(this.http.get(SpotifyConstants.GET_RELATED_ARTISTS + '/' + artistId + '/related-artists', { headers: headers, params: params }))
  }

  getSpotifyTopTracks(time_range: string = SpotifyConstants.SPOTIFY_TIME_RANGE_MEDIUM.value,
    limit: number = 10, offset: number = 0) {

    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + localStorage.getItem('access_token'))

    const params = new HttpParams()
      .append('time_range', time_range)
      .append('limit', limit)
      .append('offset', offset)

    return firstValueFrom(this.http.get(SpotifyConstants.GET_TOP_TRACKS, { headers: headers, params: params }))
  }

  getSpotifyGenreSeeds() {
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    return firstValueFrom(this.http.get(SpotifyConstants.GENRE_SEEDS_URL, { headers }))
  }

  getUserFollowedArtists() {
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    const params = new HttpParams()
      .append('type', 'artist')
      .append('limit', '50')
    return firstValueFrom(this.http.get(SpotifyConstants.GET_FOLLOWED_ARTISTS, { headers: headers, params: params }))
  }

  getRecommendations(seed_artists: string, seed_genres: string, limit: number, selectedVibeIdx?: number) {
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + localStorage.getItem('access_token'))

      let params = new HttpParams()
      .append('seed_artists', seed_artists)
      .append('seed_genres', seed_genres)
      .append('limit', limit)

    if(selectedVibeIdx !== undefined) {

      const selectedVibe = SpotifyConstants.VIBES_ALL[selectedVibeIdx]

      params
      .append('target_energy', selectedVibe.min_energy)
      .append('target_danceability', selectedVibe.min_danceability)
      .append('target_liveness', selectedVibe.min_liveness)
      .append('target_valence', selectedVibe.min_valence)
      .append('target_acousticness', selectedVibe.min_acousticness)
      .append('target_instrumentalness', selectedVibe.min_instrumentalness)
      .append('target_energy', selectedVibe.max_energy)
      .append('target_danceability', selectedVibe.max_danceability)
      .append('target_liveness', selectedVibe.max_liveness)
      .append('target_valence', selectedVibe.max_valence)
      .append('target_acousticness', selectedVibe.max_acousticness)
      .append('target_instrumentalness', selectedVibe.max_instrumentalness)

    } 

    return firstValueFrom(this.http.get(SpotifyConstants.GET_RECOMMENDATIONS, { headers: headers, params: params }))

  }

  getAudioFeatures(tracks: string) {
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    const params = new HttpParams()
      .append('ids', tracks)

    return firstValueFrom(this.http.get(SpotifyConstants.GET_AUDIO_FEATURES, { headers: headers, params: params }))
  }

  createPlaylist(playlist: PlaylistRequest) {

    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
      .set('Content-Type', 'application/json')

      let body: any = {
        name: playlist.title,
        public: playlist.isPublic,
        collaborative: playlist.isCollaborative,
        description: playlist.description
      }

    return lastValueFrom(this.http.post(SpotifyConstants.CREATE_PLAYLIST + '/' + playlist.id + '/playlists',
    JSON.stringify(body), { headers: headers }))
  }

  addImageToPlaylist(imageData: string, playlist_id: string) {
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + localStorage.getItem('access_token'))

      return lastValueFrom(this.http.put(SpotifyConstants.ADD_TO_IMG_PLAYLIST + '/' + playlist_id + '/images',
      imageData, { headers: headers }))
  }

  addItemsToPlaylist(songs: string[], playlist_id: string) {

    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + localStorage.getItem('access_token'))

    let body: any = {
      uris: songs
    }

    return lastValueFrom(this.http.post(SpotifyConstants.ADD_TO_PLAYLIST + '/' + playlist_id + '/tracks',
      JSON.stringify(body), { headers: headers }))

  }

  modifyPlaylistDetails(playlist: ModifyPlaylistRequest) {
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
      .set('Content-Type', 'application/json')

      let body: any = {
        name: playlist.title,
        public: playlist.isPublic,
        collaborative: playlist.isCollaborative,
        description: playlist.description
      }

      return lastValueFrom(this.http.put(SpotifyConstants.CHANGE_PLAYLIST_DETAILS + '/' + playlist.playlistId,
      JSON.stringify(body), { headers: headers }))

  }

  deleteItemsFromPlaylist(playlist: ModifyPlaylistRequest, oldSongs: string[]) {

    let tracks:any = []

    for(let o of oldSongs) {

      let track:any = {
        uri: o
      }
      tracks.push(track)
    }

    console.info(tracks)
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + localStorage.getItem('access_token'))

    let body:any = {
      tracks: tracks
    }

    console.info(body)

    return lastValueFrom(this.http.delete(SpotifyConstants.ADD_TO_PLAYLIST + '/' + playlist.playlistId + '/tracks',
       { headers: headers, body: JSON.stringify(body)}))

  }
}
