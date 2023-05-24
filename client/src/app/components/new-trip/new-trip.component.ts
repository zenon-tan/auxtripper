import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapDirectionsService } from '@angular/google-maps';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { DataConstants } from 'src/app/constants/google-route.constant';
import { Direction, DirectionRequest, TripDisplay } from 'src/app/models/direction';
import { Location, Routes } from 'src/app/models/google-maps-models';
import { Trip } from 'src/app/models/direction';
import { DirectionsService } from 'src/app/services/directions.service';
import { FormatTimeService } from 'src/app/services/format-time.service';
import { GoogleRequestService } from 'src/app/services/google-request.service';
import { GoogleRouteService } from 'src/app/services/google-route.service';
import { SpotifyGetUserService } from 'src/app/services/spotify-api.service';
import { SpotifyUser } from 'src/app/models/spotify-models';
import { AuthStorageService } from 'src/app/services/auth-storage.service';
import { SaveDataService } from 'src/app/services/save-data.service';
import { SpotifyAuthService } from 'src/app/services/spotify-auth.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: ['./new-trip.component.css']
})
export class NewTripComponent implements OnInit, OnDestroy {


  username = ''
  spotifyUser!: SpotifyUser
  
  travelModes: any[] = DataConstants.travelModes
  transitOptionsSelect: any[] = DataConstants.transitOptionsSelect
  transitOptions: google.maps.TransitMode[] = DataConstants.transitOptions
  directionsRenderOption = DataConstants.directionsRenderOption
  options: any = DataConstants.options
  defaults = { today: new Date(), when: 'depart' }
  dateControl!: FormControl

  form!: FormGroup
  trip!: Trip

  tripDisplay!: TripDisplay

  origin!: Location
  destination!: Location
  arrivalTime!: Date
  departureTime!: Date
  when!: string
  travelMode!: string
  time!: Date
  selectedRoute: number = 0
  removedRoute!: number | null
  hasResults: boolean = true

  travelDate: string = ''

  zoom = 15
  center!: google.maps.LatLngLiteral
  marker!: any

  routes: Routes[] = []
  saveRequest!: DirectionRequest
  direction!: Direction

  showRoute: boolean = false

  directionsResults$: Observable<google.maps.DirectionsResult | undefined> | undefined;
  routeLength$!: Observable<number[]>
  geocodeResult$!: Observable<string>

  param$!: Subscription

  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private mapDirectionsService: MapDirectionsService,
    private directionsService: DirectionsService,
    private googleRouteService: GoogleRouteService,
    private googleRequestService: GoogleRequestService,
    private locationService: LocationService,
    private formatTimeService: FormatTimeService,
    private authStorageService: AuthStorageService,
    private saveDataService: SaveDataService,
    private spotifyAuthService: SpotifyAuthService

  ) { }

  ngOnInit(): void {

    this.param$ = this.activatedRoute.queryParams.subscribe(
      (params: any) => {
        // console.info(params)
        this.trip = params as Trip
      }
    )

    this.travelDate = this.trip.time.toString().slice(4, 15)
    this.travelMode = this.trip.travelMode.toUpperCase()
    this.origin = this.googleRequestService.createOriginLocationObject(this.trip)
    this.destination = this.googleRequestService.createDestinationLocationObject(this.trip)
    this.time = new Date(this.trip.time)

    const formattedTime = this.formatTimeService.formatToFormTime(this.trip.time)
    this.when = this.trip.when

    this.dateControl = new FormControl(new Date(formattedTime))
    this.getRoute(
      this.origin.latlng,
      this.destination.latlng,
      this.setTravelMode(this.trip.travelMode), this.time, this.trip.when, this.transitOptions)

    this.form = this.fb.group({
      origin: this.fb.control<string>('', [Validators.required]),
      destination: this.fb.control<string>('', [Validators.required]),
      when: this.fb.control<string>('depart', [Validators.required]),
      travelMode: this.fb.control<string>('transit', [Validators.required]),
      date: this.fb.control<Date>(this.time),
    })

    this.form.controls['origin'].setValue(this.origin.address)
    this.form.controls['destination'].setValue(this.destination.address)
    this.form.controls['when'].setValue(this.when)
    this.form.controls['travelMode'].setValue(this.travelMode)
  }

  ngOnDestroy(): void {
    this.param$.unsubscribe()
  }

  processForm() {

    const formDate = this.form.value['date']
    this.when = this.form.value['when']

    this.travelDate = formDate.toString().slice(4, 15)

    if (this.form.value['when'] == 'now') {
      this.time = new Date()
    } else {
      this.time = this.form.value['date']
    }

    let mode: google.maps.TravelMode = this.setTravelMode(this.travelMode)

    this.getRoute(
      this.origin.latlng,
      this.destination.latlng,
      mode, formDate, this.when, this.transitOptions)

    this.showRoute = false

  }

  setTravelTime(event: any) {
    // console.info(event)
    this.form.controls['when'].setValue(event)
    this.when = event
    this.getRoute(
      this.origin.latlng, this.destination.latlng, this.setTravelMode(this.travelMode),
      this.time, this.when, this.transitOptions)
    this.updateParam()
  }

  getOrigin(event: any) {
    this.origin.latlng = event.geometry.location.toJSON()
    this.origin.address = event.formatted_address
  }

  getDest(event: any) {
    this.destination.latlng = event.geometry.location.toJSON()
    this.destination.address = event.formatted_address
  }

  setTravelMode(travelMode: string): google.maps.TravelMode {

    for (let m of this.travelModes) {
      if (m.name == travelMode) {
        return m.value
      }
    }
    return google.maps.TravelMode.DRIVING
  }

  selectTravelMode(idx: number) {
    this.travelMode = this.travelModes[idx].name
    this.form.controls['travelMode'].setValue(this.travelMode)
    this.removedRoute = null
    this.processForm()
  }

  getTravelModeChange() {
    this.travelMode = this.form.controls['travelMode'].value
    this.updateParam()
  }

  getRoute(origin: any, dest: any,
    travelMode: google.maps.TravelMode, time: Date, when: string,
    transitOps: google.maps.TransitMode[]) {


    const request = this.directionsService.getDirections(
      origin, dest, travelMode, time, when, transitOps)

    this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(
      (response: any) => {
        if (response.status != 'ZERO_RESULTS') {
          // console.info(response)
          // console.info(response.result.request.destination.location.toJSON())
          this.saveRequest = this.googleRequestService.createRequestObject(this.time, this.travelMode, this.origin,
            this.destination, this.when)
          this.routes = this.googleRouteService.createRouteObject(response.result)
          // console.info(this.saveRequest)
          // Check if transit mode routes contain only walking directions
          // If so remove them
          if (travelMode == google.maps.TravelMode.TRANSIT) {
            let idx = 0
            for (let t of this.routes) {
              let legTravelModes: string[] = []
              for (let l of t.legs[0].steps) {
                legTravelModes.push(l.travel_mode)
              }
              if (!legTravelModes.includes("TRANSIT")) {
                this.removedRoute = idx

              }
              idx++
            }
          }
          this.hasResults = true
          return response.result
        }
        else {
          this.hasResults = false
        }
      }
    ))

    // Generate an array of numbers based on the number of available routes
    this.routeLength$ = this.mapDirectionsService.route(request).pipe(map(
      (response: any) => {
        return Array(response.result.routes.length).fill(1).map((x, i) => i + 1)
      }
    ))
  }

  getAlternativeRoute(routeVal: number) {
    this.selectedRoute = routeVal
    this.directionsRenderOption.routeIndex = routeVal

    this.getRoute(
      this.origin.latlng, this.destination.latlng, this.setTravelMode(this.travelMode),
      this.time, this.trip.when, this.transitOptions)
  }

  connectSpotify() {

    this.direction = this.googleRequestService.createDirectionObject(this.time, this.routes,
      this.selectedRoute, this.origin, this.destination, this.when, this.travelMode)

    this.tripDisplay = this.googleRequestService.createTripDisplayObject(this.direction)
    // console.info(this.direction)
    // console.info(this.tripDisplay)
    sessionStorage.setItem('direction', JSON.stringify(this.direction))
    sessionStorage.setItem('tripDisplay', JSON.stringify(this.tripDisplay))

    if (this.authStorageService.isLoggedIn()) {
      // If user is logged in, check if user holds the spotify object in db
      // If yes, get the object and refresh token and authorize
      // If no, go to connect-spotify
      this.username = JSON.parse(localStorage.getItem('auth-user')!).username

      this.saveDataService.checkIfSpotifyUserExists(this.username).then(
        (exists: any) => {
          if (exists) {

            console.info("object exists")

            this.saveDataService.getSpotifyUser(this.username).then(
              (data: any) => {
                this.spotifyUser = data as SpotifyUser
                sessionStorage.setItem('spotifyUser', JSON.stringify(this.spotifyUser))
                this.spotifyAuthService.refreshSpotify(data.refreshToken).then(
                  (newData: any) => {
                    console.info("token refreshed")
                    localStorage.setItem('refresh_token', newData.refresh_token)
                    this.saveDataService.updateRefreshToken(this.username, newData.refresh_token).then(
                      (isSaved: any) => {
                        if(isSaved == true) {
                          console.info("token updated in db")
                        }
                      }
                    )
                  }
                  // replace the refresh_toke
                  // update refresh token in db
                )
                this.router.navigate(['/playlist/new'])
              }
            )

          } else {
            console.info("object does not exist")
            this.router.navigate(['/connect-spotify'])
          }
          // this.router.navigate(['/playlist/new'])
        }
      ).catch(
        (e) => {
          console.info(e)
        }
      )
    }

    this.router.navigate(['/connect-spotify'])

    // this.spotifyGetUserService.getSpotifyCurrentUser().then(
    //   (data: any) => {
    //     if (data == null) {
    //       this.router.navigate(['/connect-spotify'])
    //     }
    //     this.router.navigate(['/playlist/new'])
    //   }
    // )

    // this.router.navigate(['/connect-spotify'])
    // this.router.navigate(['/playlist/new'])
  }

  setFormTime(event: any) {
    this.time = event
    this.travelDate = event.toString().slice(4, 15)
    this.dateControl.setValue(this.formatTimeService.formatToFormTime(<any>this.time.toString()))
    this.getRoute(
      this.origin.latlng,
      this.destination.latlng,
      this.setTravelMode(this.travelMode), this.time, this.trip.when, this.transitOptions)
  }

  updateParam() {
    const queryParams: Params = {
      origin: this.origin.address,
      destination: this.destination.address,
      origin_lat: this.origin.latlng.lat,
      origin_lng: this.origin.latlng.lng,
      destination_lat: this.destination.latlng.lat,
      destination_lng: this.destination.latlng.lng,
      travelMode: this.travelMode,
      when: this.when,
      time: this.time
    }

    // this.router.navigate(['.'],
    //   {
    //     relativeTo: this.route,
    //     queryParams: queryParams,
    //     queryParamsHandling: 'merge'
    //   })

    const urlTree = this.router.createUrlTree([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
      preserveFragment: true
    })

    this.router.navigateByUrl(urlTree)
  }


}
