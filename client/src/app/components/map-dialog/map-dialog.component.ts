import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoogleMap, MapDirectionsService } from '@angular/google-maps';
import { Observable, map } from 'rxjs';
import { DataConstants } from 'src/app/constants/google-route.constant';
import { Direction, DirectionRequest } from 'src/app/models/direction';
import { Location, Routes } from 'src/app/models/google-maps-models';
import { DirectionsService } from 'src/app/services/directions.service';
import { GoogleRouteService } from 'src/app/services/google-route.service';

@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.css']
})
export class MapDialogComponent implements OnInit, OnDestroy {

  googleMap!: GoogleMap

  travelModes: any[] = DataConstants.travelModes
  transitOptionsSelect: any[] = DataConstants.transitOptionsSelect
  transitOptions: google.maps.TransitMode[] = DataConstants.transitOptions
  directionsRenderOption = DataConstants.directionsRenderOption
  options: any = DataConstants.options


  origin!: Location
  destination!: Location
  when: any
  travelMode!: string
  time!: Date
  selectedRoute: number = 0
  removedRoute!: number | null
  hasResults: boolean = true

  travelDate: string = ''

  zoom = 14
  center!: google.maps.LatLngLiteral
  marker!: any

  routes: Routes[] = []
  saveRequest!: DirectionRequest
  direction!: Direction

  directionsResults$: Observable<google.maps.DirectionsResult | undefined> | undefined;
  routeLength$!: Observable<number[]>

  constructor(

    private mapDirectionsService: MapDirectionsService,
    private directionsService: DirectionsService,
    private googleRouteService: GoogleRouteService,) { }

  ngOnInit(): void {

    this.direction = JSON.parse(sessionStorage.getItem('direction')!)
    console.info(this.direction)
    this.getAlternativeRoute(this.direction.chosenRoute)

    this.getRoute(
      this.direction.directionRequest.origin.latlng,
      this.direction.directionRequest.destination.latlng,
      this.setTravelMode(this.direction.directionRequest.travelMode),
      new Date(this.direction.directionRequest.time),
      this.direction.directionRequest.travelWhen,
      this.transitOptions)

  }

  ngOnDestroy(): void {

  }

  setTravelMode(travelMode: string): google.maps.TravelMode {

    for (let m of this.travelModes) {
      if (m.name == travelMode) {
        return m.value
      }
    }
    return google.maps.TravelMode.DRIVING
  }

  getRoute(origin: any, dest: any,
    travelMode: google.maps.TravelMode, time: Date, when: string,
    transitOps: google.maps.TransitMode[]) {

    const request = this.directionsService.getDirections(
      origin, dest, travelMode, time, when, transitOps)

    this.directionsResults$ = this.mapDirectionsService.route(request)
      .pipe(map(
        (response: any) => {
          if (response.status != 'ZERO_RESULTS') {
            this.routes = this.googleRouteService.createRouteObject(response.result)
            console.info(this.routes)
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

    this.routeLength$ = this.mapDirectionsService.route(request).pipe(map(
      (response: any) => {
        return Array(response.result.routes.length).fill(1).map((x, i) => i + 1)
      }
    ))

  }

  getAlternativeRoute(routeVal: number) {
    this.selectedRoute = routeVal
    this.directionsRenderOption.routeIndex = routeVal
  }

}
