import { Component, OnInit } from '@angular/core';
import { Artist, SpotifyUser, Track } from 'src/app/models/spotify-models';
import { Direction } from 'src/app/models/direction';
import { SpotifyGetUserService } from 'src/app/services/spotify-api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { SpotifyConstants } from 'src/app/constants/spotify-api.constant';
import { Router } from '@angular/router';
import { SpotifyObjectService } from 'src/app/services/spotify-object.service';
import { AuthStorageService } from 'src/app/services/auth-storage.service';
import { SaveDataService } from 'src/app/services/save-data.service';

@Component({
  selector: 'app-new-playlist',
  templateUrl: './new-playlist.component.html',
  styleUrls: ['./new-playlist.component.css']
})
export class NewPlaylistComponent implements OnInit {

  direction!: Direction
  form!: FormGroup

  constructor(
    private spotifyGetUserService: SpotifyGetUserService,
    private spotifyObjectService: SpotifyObjectService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  refreshToken = ''

  selectedArtists: string[] = []
  _selectedArtistsDisplay: string[] = []
  _selectedGenresDisplay: string[] = []
  selectedGenres: any[] = []
  selectedTimeRange = 'long_term'
  customGenres: any[] = []
  customArtists: any[] = []
  searchedGenre = ''
  searchedArtist = ''

  artists!: Artist[]
  artists$: Observable<Artist[] | undefined> | undefined
  mySavedArtists!: Artist[]
  tracks!: Track[]
  genreSeeds: string[] = []
  artistsSeeds: string[] = []
  spotifyUser!: SpotifyUser
  topGenres!: string[]

  SPOTIFY_TIME_RANGE: any = SpotifyConstants.SPOTIFY_TIME_RANGE

  myGenre: FormControl = new FormControl();
  myArtist: FormControl = new FormControl();

  filteredGenreSeeds!: Observable<string[]>
  filteredArtistSeeds!: Observable<string[]>

  ngOnInit(): void {

    // Check if route is in session, if not, redirect back to landing
    if (JSON.parse(sessionStorage.getItem('direction')!) != null) {
      this.direction = JSON.parse(sessionStorage.getItem('direction')!)
    } else {
      this.router.navigate(['/'])
    }

    this.spotifyUser = {
      displayName: JSON.parse(sessionStorage.getItem('spotifyUser')!).displayName,
      email: JSON.parse(sessionStorage.getItem('spotifyUser')!).email,
      id: JSON.parse(sessionStorage.getItem('spotifyUser')!).id
    }

    this.getPageData()
    this.spotifyGetUserService.getSpotifyGenreSeeds().then(
      (data: any) => {
        // console.info(data.genres)
        this.genreSeeds = data.genres as string[]
      }
    )

    this.filteredGenreSeeds = this.myGenre.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterGenre(val))
      );


    this.filteredArtistSeeds = this.myArtist.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterArtist(val))
      );

    this.selectedArtists = []

    this.form = this.fb.group({
      playlistDuration: this.fb.control<number>(this.direction.duration, [Validators.required]),
      artists: this.fb.control<string[]>([], [Validators.required, Validators.minLength(1)]),
      genres: this.fb.control<string[]>([], [Validators.required, Validators.minLength(1)])
    })

  }

  getPageData() {

    this.artists$ = this.spotifyGetUserService.getSpotifyTopArtists(this.selectedTimeRange, 50, 0).pipe(
      map(
        (data: any) => {
          // console.info(data)
          this.artists = this.spotifyObjectService.convertToArtists(data.items)
          this.topGenres = this.spotifyObjectService.generateTopGenres(this.artists)
          this.spotifyGetUserService.getUserFollowedArtists().then(
            (data: any) => {
              // console.info(data)
              this.mySavedArtists = []
              this.mySavedArtists = this.spotifyObjectService.convertToArtists(data.artists.items)
              for (let a of this.mySavedArtists) {
                if ((!this.artistsSeeds.includes(a.name))) {
                  this.artistsSeeds.push(a.name)
                }
              }
              for (let a of this.artists) {
                if (this.artistsSeeds.includes(a.name)) {
                  this.artistsSeeds.splice(this.artistsSeeds.indexOf(a.name), 1)
                }
              }
            }
          )
          return this.spotifyObjectService.convertToArtists(data.items)
        }
      )
    )

    this.spotifyGetUserService.getSpotifyTopTracks('long_term', 100, 0).then(
      (data: any) => {
        // console.info(data)
        this.tracks = this.spotifyObjectService.convertToTracks(data.items)
      }
    )
  }

  processForm() {
    let artistsDb: Artist[] = []

    for (let a of this.artists) {
      if (this.selectedArtists.includes(a.name)) {
        artistsDb.push(a)
      }
    }

    sessionStorage.setItem('artists', JSON.stringify(artistsDb))
    sessionStorage.setItem('genres', JSON.stringify(this.selectedGenres))

    this.router.navigate(['/playlist/summary'])
  }

  filterGenre(val: string): string[] {
    return this.genreSeeds.filter(genre =>
      genre.toLowerCase().indexOf(val.toLowerCase()) === 0)
  }

  filterArtist(val: string): string[] {
    return this.artistsSeeds.filter(artist =>
      artist.toLowerCase().indexOf(val.toLowerCase()) === 0)
  }

  getGenres(genres: any) {
    if (genres.length > 5) {
      genres.shift()
      this.selectedGenres.shift()
      this._selectedGenresDisplay = genres
    }

    for (let a of genres) {
      if (!this.selectedGenres.includes(a) && this.selectedGenres.length < 5) {
        this.selectedGenres.push(a)
        this._selectedGenresDisplay.push(a)
      }

      if (!this.selectedGenres.includes(a) && this.selectedGenres.length >= 5) {
        this.selectedGenres.shift()
        this.selectedGenres.push(a)
        this._selectedGenresDisplay.shift()
        this._selectedGenresDisplay.push(a)

      }
    }
  }

  getArtists(artists: any) {
    if (artists.length > 5) {
      artists.shift()
      this.selectedArtists.shift()
      this._selectedArtistsDisplay = artists
    }

    for (let a of artists) {
      if (!this.selectedArtists.includes(a) && this.selectedArtists.length < 5) {
        this.selectedArtists.push(a)
        this._selectedArtistsDisplay.push(a)
      }

      if (!this.selectedArtists.includes(a) && this.selectedArtists.length >= 5) {
        this.selectedArtists.shift()
        this.selectedArtists.push(a)
        this._selectedArtistsDisplay.shift()
        this._selectedArtistsDisplay.push(a)
      }
    }
  }

  toggleArtist(event: any) {
    if (event.source._checked && this.selectedArtists.length < 5) {
      this.selectedArtists.push(event.source.value as string)
    }
    if (!event.source._checked) {
      this.selectedArtists.splice(this.selectedArtists.indexOf(event.source.value), 1)
    }
  }

  toggleGenre(event: any) {
    if (event.source._checked && this.selectedGenres.length < 5) {
      this.selectedGenres.push(event.source.value as string)
    }

    if (!event.source._checked) {
      this.selectedGenres.splice(this.selectedGenres.indexOf(event.source.value), 1)
    }
  }

  getTimeRange(range: any) {
    this._selectedArtistsDisplay = []
    this.selectedTimeRange = range
    this.getPageData()

    for (let a of this.artists) {
      if (this.selectedArtists.includes(a.name)) {
        this._selectedArtistsDisplay.push(a.name)
      }
    }
    console.info(this.customArtists)
    for(let a of this.customArtists) {
      this._selectedArtistsDisplay.push(a.name)
    }

  }

  searchGenres(event: any) {
    this.customGenres.push(event.option.value)
    this._selectedGenresDisplay.push(event.option.value)
    this.searchedGenre = ''
  }

  searchArtist(event: any) {
    for (let a of this.mySavedArtists) {
      if (a.name.toLowerCase() == event.option.value.toLowerCase()) {

        this.customArtists.push(a)
        this._selectedArtistsDisplay.push(a.name)
      }
    }
    this.searchedArtist = ''
  }
}
