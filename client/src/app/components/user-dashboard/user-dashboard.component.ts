import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataConstants } from 'src/app/constants/google-route.constant';
import { DashboardModel, Itinerary } from 'src/app/models/itinerary';
import { AuthStorageService } from 'src/app/services/auth-storage.service';
import { GoogleRequestService } from 'src/app/services/google-request.service';
import { SaveDataService } from 'src/app/services/save-data.service';
import { MapDialogComponent } from '../map-dialog/map-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Direction, DirectionRequest } from 'src/app/models/direction';
import { Location } from 'src/app/models/google-maps-models';
import { Artist, SpotifyUser, Track, Vibe } from 'src/app/models/spotify-models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpotifyObjectService } from 'src/app/services/spotify-object.service';
import { SpotifyGetUserService } from 'src/app/services/spotify-api.service';
import { ModifyPlaylistRequest } from 'src/app/models/playlist';
import { FormatTimeService } from 'src/app/services/format-time.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  @ViewChild('fileInput')
  imageFile!: ElementRef

  matCardStyle!: string

  form!: FormGroup
  travelModes: any[] = DataConstants.travelModes
  sortByDateMap: Map<string, DashboardModel[]> = new Map<string, DashboardModel[]>()
  itineraries: Itinerary[] = []
  sortedTravelDates: string[] = []
  isTripSelected = false
  isModifyTrip = false
  playlistEmbedUrl = ''
  playlistUrl = ''
  playlistUri = ''
  spotifyUser!: SpotifyUser

  isPlaylistModified = false

  relatedArtists!: Artist[]
  artists!: Artist[]
  selectedArtists: string[] = []
  selectedArtistsId: string[] = []
  selectedGenres: any[] = []
  vibe!: Vibe

  allTracks: Track[] = []
  allTracksMap: Map<string, Track> = new Map<string, Track>
  allTrackIds: string[] = []
  lockedTracks: Track[] = []
  lockedTrackIds: string[] = []
  displayTracks: Track[] = []
  displayTrackIds: string[] = []
  backupTracks: Track[] = []
  backupTrackIds: string[] = []
  duration = 0
  playlistDuration = ''
  playlistId: string = ''
  dbplaylistId!: number

  username!: string

  hasTracks = true

  optionsPanel = false

  oldSongs: Track[] = []
  oldSongIds: string[] = []
  oldPlaylistTitle!: string
  oldPlaylistDescription!: string
  oldIsPublic!: boolean
  oldIsCollaborative!: boolean
  imageData!: any

  selectedTrip!: DashboardModel
  selectedTripIdx!: number

  panelOpenState = false
  dateToBeDisplayed = ''

  constructor(private authStorageService: AuthStorageService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private saveDataService: SaveDataService,
    private googleRequestService: GoogleRequestService,
    private spotifyModelService: SpotifyObjectService,
    private spotifyGetUserService: SpotifyGetUserService,
    private formatTimeService: FormatTimeService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.matCardStyle = 'trip-card'

    this.saveDataService.getAllUserItineraries(this.authStorageService.getUser().username).then(
      (data: any) => {
        this.username = this.authStorageService.getUser().username
        // console.info(data)
        this.itineraries = data as Itinerary[]

        this.sortItinerariesByTravelDate()
        this.sortTravelDates()

        this.dateToBeDisplayed = this.sortedTravelDates[0]

        // if user comes from playlist creation, show them the trip by default
        if (this.activatedRoute.snapshot.queryParams['id'] != null) {
          const itineraryIdToBeDisplayed = this.activatedRoute.snapshot.queryParams['id']
          for (let kv of this.sortByDateMap.entries()) {

            for (let i of kv[1]) {
              if (i.itinerary.id === itineraryIdToBeDisplayed) {
                this.dateToBeDisplayed = i.tripDisplay.travelDate
                const selectedTripArray = this.sortByDateMap.get(i.tripDisplay.travelDate)

                for (let s of selectedTripArray!) {
                  if (s.itinerary.id === i.itinerary.id) {
                    this.selectedTripIdx = selectedTripArray!.indexOf(s)
                    this.selectedTrip = s
                    this.playlistId = this.selectedTrip.itinerary.playlist.playlistId
                    this.playlistEmbedUrl = 'https://open.spotify.com/embed/playlist/' + this.playlistId + '?utm_source=generator&theme=0'
                    this.playlistUrl = 'https://open.spotify.com/playlist/' + this.playlistId
                    this.playlistUri = 'spotify:playlist:' + this.playlistId
                    this.isTripSelected = true
                  }
                }
              }
            }
          }
        }
      }
    )

    this.spotifyUser = JSON.parse(sessionStorage.getItem('spotifyUser')!)

    this.form = this.fb.group({
      playlistTitle: this.fb.control<string>(''),
      playlistDescription: this.fb.control<string>(''),
      playlistImage: this.fb.control(''),
      isPublic: this.fb.control<boolean>(false),
      isCollaborative: this.fb.control<boolean>(false)
    })

  }

  sortItinerariesByTravelDate() {
    for (let i of this.itineraries) {
      const travelDate = i.direction.travelDate as string
      i.direction.directionRequest.time = new Date(i.direction.directionRequest.time)
      const display = this.googleRequestService.createTripDisplayObject(i.direction)
      if (this.sortByDateMap.has(travelDate)) {
        const model: DashboardModel = {
          itinerary: i,
          tripDisplay: display
        }
        this.sortByDateMap.get(travelDate)?.push(model)
      } else {
        let arr: DashboardModel[] = []
        const model: DashboardModel = {
          itinerary: i,
          tripDisplay: display
        }
        arr.push(model)
        this.sortByDateMap.set(travelDate, arr)
      }
    }
  }

  sortTravelDates() {
    const keys = this.sortByDateMap.keys()
    for (let k of keys) {
      this.sortedTravelDates.push(k)
    }
    this.sortedTravelDates.sort((a, b) => new Date(a) > new Date(b) ? 1 : -1);
  }

  selectTrip(date: string, idx: number) {
    // console.info(idx)
    this.selectedTripIdx = idx
    this.matCardStyle = 'trip-card-selected'
    this.isTripSelected = true
    this.selectedTrip = this.sortByDateMap.get(date)![idx]
    // console.info(this.selectedTrip)
    const direction = this.selectedTrip.itinerary.direction
    this.convertToMapDialogDirection(direction)

    this.playlistId = this.selectedTrip.itinerary.playlist.playlistId
    this.playlistEmbedUrl = 'https://open.spotify.com/embed/playlist/' + this.playlistId + '?utm_source=generator&theme=0'
    this.playlistUrl = 'https://open.spotify.com/playlist/' + this.playlistId
    this.playlistUri = 'spotify:playlist:' + this.playlistId

  }

  modifyPlaylist() {
    this.isModifyTrip = true
    // console.info(this.selectedTrip)
    this.oldSongs = this.selectedTrip.itinerary.playlist.tracks
    this.oldSongIds = this.selectedTrip.itinerary.playlist.playlistRequest.songs
    // console.info(this.oldSongIds)
    for (let t of this.oldSongs) {
      const uri = 'https://open.spotify.com/embed/track/' + t.trackId + '?utm_source=generator&theme=0'
      this.displayTrackIds.push(uri)
    }
    this.artists = this.selectedTrip.itinerary.playlist.artists
    this.setUpSelectedArtists()

    this.dbplaylistId = this.selectedTrip.itinerary.playlist.playlistRequest.id

    this.selectedGenres = this.selectedTrip.itinerary.playlist.genres
    // console.info(this.selectedGenres)
    this.imageData = this.selectedTrip.itinerary.playlist.playlistRequest.imageData

    this.oldPlaylistTitle = this.selectedTrip.itinerary.playlist.playlistRequest.title
    this.oldPlaylistDescription = this.selectedTrip.itinerary.playlist.playlistRequest.description
    this.oldIsPublic = this.selectedTrip.itinerary.playlist.playlistRequest.isPublic
    this.oldIsCollaborative = this.selectedTrip.itinerary.playlist.playlistRequest.isCollaborative

    this.form.controls['playlistTitle'].setValue(this.oldPlaylistTitle)
    this.form.controls['playlistDescription'].setValue(this.oldPlaylistDescription)
    // this.form.controls['playlistImage'].setValue(this.imageData)
    this.form.controls['isPublic'].setValue(this.oldIsPublic)
    this.form.controls['isCollaborative'].setValue(this.oldIsCollaborative)
  }

  deleteTrip() {
    this.isTripSelected = false
    const itineraryIdToDeleted = this.selectedTrip.itinerary.id
    let value = this.sortByDateMap.get(this.selectedTrip.tripDisplay.travelDate)!
    for (let t of value) {
      if (t.itinerary.id === this.selectedTrip.itinerary.id) {
        const idx = value.indexOf(t)
        this.sortByDateMap.get(this.selectedTrip.tripDisplay.travelDate)!.splice(idx, 1)
      }
    }
    if (this.sortByDateMap.get(this.selectedTrip.tripDisplay.travelDate)!.length <= 0) {
      console.info('hey hey')
      this.sortByDateMap.delete(this.selectedTrip.tripDisplay.travelDate)
      this.sortedTravelDates.splice(this.sortedTravelDates.indexOf(this.selectedTrip.tripDisplay.travelDate), 1)
    }

    this.saveDataService.deleteItineraryById(itineraryIdToDeleted)
    if (this.sortedTravelDates.length <= 0) {
      this.itineraries = []
    }
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(MapDialogComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  convertToMapDialogDirection(directionFromDb: Direction) {

    const directionRequest = directionFromDb.directionRequest
    const origin: Location = {
      address: directionRequest.location.originAddress,
      latlng: { lat: directionRequest.location.originLat, lng: directionRequest.location.originLng } as google.maps.LatLngLiteral

    }
    const destination: Location = {
      address: directionRequest.location.destinationAddress,
      latlng: { lat: directionRequest.location.destinationLat, lng: directionRequest.location.destinationLng } as google.maps.LatLngLiteral

    }
    const mapDialogDirectionRequest: DirectionRequest = {
      origin: origin,
      destination: destination,
      location: directionRequest.location,
      time: directionRequest.time,
      travelWhen: directionRequest.travelWhen,
      travelMode: directionRequest.travelMode
    }
    const mapDialogDirection: Direction = {
      travelDate: directionFromDb.travelDate,
      duration: directionFromDb.duration,
      chosenRoute: directionFromDb.chosenRoute,
      directionRequest: mapDialogDirectionRequest
    }
    sessionStorage.setItem('direction', JSON.stringify(mapDialogDirection))

  }

  processForm() {

    // Get all neccessary fields
    let title = this.form.value['playlistTitle']
    let description = this.form.value['playlistDescription']
    let isPublic = this.form.value['isPublic']
    let isCollaborative = this.form.value['isCollaborative']
    let tracks: Track[] = []
    let selectedTrackIFrames: string[] = []
    let trackIds: string[] = []

    // Combined locked and display tracks
    selectedTrackIFrames.push(...this.lockedTrackIds, ...this.displayTrackIds)
    for (let t of selectedTrackIFrames) {
      if (this.allTracksMap.has(t)) {
        tracks.push(this.allTracksMap.get(t)!)
        trackIds.push(this.allTracksMap.get(t)!.uri)
      }
    }

    const modifyPlaylistRequest: ModifyPlaylistRequest = {
      dbPlaylistId: this.dbplaylistId,
      playlistId: this.playlistId,
      title: title,
      isPublic: isPublic,
      isCollaborative: isCollaborative,
      description: description,
      songs: trackIds,
      tracks: tracks,
      imageData: this.imageData

    }

    console.info(this.oldSongIds)
    console.info('trackIds: ' + trackIds)
    this.spotifyGetUserService.modifyPlaylistDetails(modifyPlaylistRequest).then(
      (data:any) => {
        console.info(data)
      }
    )
    this.spotifyGetUserService.deleteItemsFromPlaylist(modifyPlaylistRequest, this.oldSongIds).then(
      (data:any) => {
        console.info(data)
      }
    )
    this.spotifyGetUserService.addItemsToPlaylist(trackIds, this.playlistId).then(
      (data:any) => {
        console.info(data)
      }
    )
    // if (trackIds.length > 0) {
    //   this.spotifyGetUserService.deleteItemsFromPlaylist(modifyPlaylistRequest, this.oldSongIds)
    //   this.spotifyGetUserService.addItemsToPlaylist(trackIds, this.playlistId)
    // }
    if (this.imageData != '') {
      this.spotifyGetUserService.addImageToPlaylist(this.imageData, this.playlistId)
    }
    this.saveDataService.modifyPlaylist(modifyPlaylistRequest).then(
      (data:any) => {
        console.info(data)
      }
    )


    this.isModifyTrip = false
    // this.router.navigate(['/dashboard'], { queryParams: { 'id': this.selectedTrip.itinerary.id } })
    this.router.navigateByUrl('/dashboard?id=' + this.selectedTrip.itinerary.id)
    window.location.reload()
  }

  goToHome() {
    this.router.navigate(['/'])
  }

  getTracks() {
    /* Spotify Recommendations only produces 100 tracks per request
    In order to get more than 100 songs, split into several requests */
    this.hasTracks = false
    this.isPlaylistModified = true
    this.displayTrackIds = []
    let promiseArr = []
    let numArr = []
    const songNum = this.selectedTrip.itinerary.playlist.tracks.length * 2
    let leftoverNum = 0
    if (songNum > 100) {
      leftoverNum = songNum % 100
      for (let i = 0; i < (songNum - leftoverNum) / 100; i++) {
        numArr.push(100)
      }
      if (leftoverNum > 0) {
        numArr.push(leftoverNum)
      }
    }

    if (songNum <= 100) {
      numArr.push(songNum)
    }

    for (let d of numArr) {
      const seeds = this.shuffleSeeds()
      promiseArr.push(this.spotifyGetUserService.getRecommendations(seeds.seed_artists, seeds.seed_genres, d))
    }

    Promise.allSettled(promiseArr).then(
      (data: any) => {
        if (data[0].status == 'rejected') {
          this.router.navigate(['/connect-spotify'])
        }

        if (data[0].value.tracks.length != 0) {
          this.hasTracks = true

          for (let d of data) {
            this.allTracks = this.spotifyModelService.convertToTracks(data[0].value.tracks)
            let tempTrackiFrameUrl: string[] = []
            for (let t of this.allTracks) {
              tempTrackiFrameUrl.push(t.iFrameUrl)
              this.allTracksMap.set(t.iFrameUrl, t)
            }
            this.allTrackIds.push(...tempTrackiFrameUrl)
          }

          const middleIndex = Math.ceil(this.allTracks.length / 2);
          const randomTracks = this.allTracks.sort(() => 0.5 - Math.random())
          this.displayTracks = randomTracks.splice(0, middleIndex)
          this.backupTracks = randomTracks

          let trackIds: string[] = []

          for (let t of this.displayTracks) {
            this.displayTrackIds.push(t.iFrameUrl)
            trackIds.push(t.trackId)
          }
          for (let t of this.backupTracks) {
            this.backupTrackIds.push(t.iFrameUrl)
          }

          const trackIdString = trackIds.join(',')

          this.spotifyGetUserService.getAudioFeatures(trackIdString).then(
            (data: any) => {
              this.vibe = this.spotifyModelService.calculateAverageFeatures(data.audio_features)
              this.duration = this.vibe.totalDuration
              this.playlistDuration = this.formatTimeService.formatToDisplayDuration(this.vibe.totalDuration / 1000)
            }
          )
        } if (data[0].value.length == 0) {
          this.getTracks()
        }
      }
    )
  }

  shuffleSeeds() {
    const randNum = Math.floor(Math.random() * 5)
    let shuffledArtist = this.selectedArtistsId.sort(() => 0.5 - Math.random())
    let shuffledGenre = this.selectedGenres.sort(() => 0.5 - Math.random())
    let selectedA = shuffledArtist.splice(0, randNum)
    let selectedG = shuffledGenre.splice(0, 5 - randNum)
    const seed_artists = selectedA.join(',')
    const seed_genres = selectedG.join(',')
    return ({ seed_artists: seed_artists, seed_genres: seed_genres })
  }

  deleteTrack(idx: number) {
    if (this.backupTrackIds.length > 0) {
      this.displayTrackIds.splice(idx, 1)
      this.displayTrackIds.splice(idx, 0, this.backupTrackIds[0])
      this.backupTrackIds.splice(0, 1)
    } else {
      this.displayTrackIds.splice(idx, 1)
    }
  }

  deleteLockedTrack(idx: number) {
    this.lockedTracks.splice(idx, 1)
    this.displayTracks.splice(idx, 0, this.backupTracks[0])
    this.backupTracks.splice(0, 1)
  }

  unlockTrack(idx: number) {
    this.displayTrackIds.splice(idx, 0, this.lockedTrackIds[idx])
    this.lockedTrackIds.splice(idx, 1)

  }

  lockTrack(idx: number) {
    this.lockedTrackIds.push(this.displayTrackIds[idx])
    this.displayTrackIds.splice(idx, 1)
  }

  setUpSelectedArtists() {
    for (let a of this.artists) {
      this.selectedArtists.push(a.name)
      this.selectedArtistsId.push(a.artistId)
    }
  }

  onFileSelected(event: any) {
    var reader = new FileReader()
    reader.readAsDataURL(event.target.files[0])
    reader.onload = (_getEventTarget) => {
      this.imageData = reader.result
    }
  }

}