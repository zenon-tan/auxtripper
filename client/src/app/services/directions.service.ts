import { Injectable } from '@angular/core';
import { MapDirectionsRenderer, MapDirectionsService } from '@angular/google-maps';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectionsService {

  request2!: google.maps.DirectionsRequest

  directionsResults$: Observable<google.maps.DirectionsResult | undefined> | undefined ;

  constructor(private mapDirectionsService : MapDirectionsService,
    ) { }

  getDirections(origin: google.maps.LatLngLiteral, dest: google.maps.LatLngLiteral, 
    travelMode: google.maps.TravelMode, time: Date, 
    aord: string, transitOptions: google.maps.TransitMode[]): google.maps.DirectionsRequest {
    
    let request: google.maps.DirectionsRequest = {
      destination: {
        lat: dest.lat,
        lng: dest.lng
      },
      origin: {
        lat: origin.lat,
        lng: origin.lng
      },
      travelMode: travelMode,
      provideRouteAlternatives: true,
      transitOptions: {
        routingPreference: google.maps.TransitRoutePreference.LESS_WALKING,
        modes: null,
        arrivalTime: null,
        departureTime: null
      }
    }

    request.transitOptions!.modes = transitOptions

    if(aord == 'arrive') {
      request.transitOptions!.arrivalTime = time
    } if (aord == 'depart') {
      request.transitOptions!.departureTime = time
    }

    return request
  }

}
