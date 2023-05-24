import { Injectable } from '@angular/core';
import { Direction } from '../models/direction';
import { Itinerary } from '../models/itinerary';
import { PlaylistRequest, Playlist } from '../models/playlist';
import { SpotifyUser, Artist, TrackArtist, Album, Track, Image, Vibe } from '../models/spotify-models';

@Injectable({
  providedIn: 'root'
})
export class SpotifyObjectService {

  constructor() { }

  convertToUser(data: any): SpotifyUser {
    let user: SpotifyUser = {
      displayName: data.display_name,
      email: data.email,
      id: data.id,
    }

    return user
  }


  convertToArtists(data: any): Artist[] {

    let artists: Artist[] = []

    for (let a of data) {
      let artist: Artist = {
        name: a.name,
        artistId: a.id,
        href: a.href,
        genres: a.genres as string[],
        uri: a.uri,
        images: this.convertToImages(a.images)
      }

      artists.push(artist)
    }

    return artists

  }

  convertToTrackArtists(data: any): TrackArtist[] {

    let artists: TrackArtist[] = []

    for (let a of data) {
      let artist: TrackArtist = {
        name: a.name,
        href: a.href,
        uri: a.uri,

      }

      artists.push(artist)
    }

    return artists

  }

  convertToAlbum(data: any): Album {
    let album: Album = {
      name: data.name,
      id: data.externalUrls.id,
      href: data.externalUrls.href,
      images: this.convertToImages(data.images)
    }

    return album
  }

  convertToImages(data: any): Image[] {
    let images: Image[] = []

    for (let i of data) {
      let img: Image = {
        url: i.url,
        height: i.height,
        width: i.width
      }
      images.push(img)
    }
    return images
  }

  convertToTracks(data: any): Track[] {
    let tracks: Track[] = []
    for (let t of data) {
      let track: Track = {
        title: t.name,
        durationMs: t.duration_ms,
        trackId: t.id,
        href: t.href,
        uri: t.uri,
        iFrameUrl: 'https://open.spotify.com/embed/track/' +
          t.id + '?utm_source=generator&theme=0',
        artists: this.convertToTrackArtists(t.artists)
      }

      tracks.push(track)
    }
    return tracks

  }

  calculateAverageFeatures(data: any) {

    let energy = 0
    let danceability = 0
    let loudness = 0
    let liveness = 0
    let valence = 0
    let duration = 0

    for (let t of data) {

      energy += t.energy
      danceability += t.danceability
      loudness += t.loudness
      liveness += t.liveness
      valence += t.valence,
        duration += t.duration_ms

    }

    let vibe: Vibe = {
      name: "Custom",
      energy: energy / data.length,
      danceability: danceability / data.length,
      loudness: Math.abs(loudness / data.length) / 60,
      liveness: liveness / data.length,
      valence: valence / data.length,
      totalDuration: duration
    }

    return vibe

  }

  convertToBackendData(spotifyUser: SpotifyUser, artists: Artist[], vibe: Vibe,
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

  generateTopGenres(artists: Artist[]): string[] {

    let topGenres: Map<string, number> = new Map<string, number>()


    for (let a of artists) {
      for (let g of a.genres) {
        let genre = g as string

        if (!topGenres.has(genre) && genre != undefined) {
          topGenres.set(g, 1)
        } else {
          let oldValue = topGenres.get(g) as number
          topGenres.set(g, oldValue + 1)
        }
      }
    }

    let genreList: string[] = []

    const sorted = new Map([...topGenres].sort((a, b) => b[1] - a[1]))
    for (let k of sorted.keys()) {

      genreList.push(k)

    }

    return genreList

  }
}
