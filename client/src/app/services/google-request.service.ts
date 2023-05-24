import { Injectable } from '@angular/core';


import { BackendLocation, Direction, DirectionRequest, Trip, TripDisplay } from '../models/direction';
import { FormatTimeService } from './format-time.service';
import { Location, Routes } from '../models/google-maps-models';

@Injectable({
  providedIn: 'root'
})
export class GoogleRequestService {

  constructor(private formatTimeService: FormatTimeService) { }

  createOriginLocationObject(trip: Trip) {
    let origin: Location = {
      latlng: {
        lat: Number.parseFloat(trip.origin_lat),
        lng: Number.parseFloat(trip.origin_lng)
      },
      address: trip.origin
    }
    return origin
  }

  createDestinationLocationObject(trip: Trip) {
    let destination: Location = {
      latlng: {
        lat: Number.parseFloat(trip.destination_lat),
        lng: Number.parseFloat(trip.destination_lng),
      },
      address: trip.destination
    }
    return destination
  }

  createDirectionObject(formDate: Date, routes: Routes[], selectedRoute: number,
    origin: Location, destination: Location, when: string, travelMode: string) {

    let direction: Direction = {
      travelDate: this.formatTimeService.formatToTravelDate(formDate.toString()),
      duration: routes[selectedRoute].legs[0].duration.value,
      chosenRoute: selectedRoute,
      directionRequest: this.createRequestObject(formDate, travelMode, origin, destination, when)
    }

    return direction
  }

  createRequestObject(time: Date, travelMode: string, origin: Location, destination: Location, when: string) {

    let directionsRequest!: DirectionRequest

    let backendLocation: BackendLocation = {
      originAddress: origin.address,
      originLat: origin.latlng.lat,
      originLng: origin.latlng.lng,
      destinationAddress: destination.address,
      destinationLat: destination.latlng.lat,
      destinationLng: destination.latlng.lng
    }

    directionsRequest = {
      origin: origin,
      destination: destination,
      location: backendLocation,
      time: time,
      travelWhen: when,
      travelMode: travelMode
    }

    return directionsRequest
  }

  createTripDisplayObject(direction: Direction) {

    let arrivalTime = ''
    let departureTime = ''

    let time = direction.directionRequest.time
    let duration = direction.duration
    let when = direction.directionRequest.travelWhen

    if (when != 'arrive') {
      arrivalTime = this.formatTimeService.formatToDisplayTime(this.formatTimeService.calculateArrivalTime(time, duration))
      departureTime = this.formatTimeService.formatToDisplayTime(time.toLocaleString().split(', ')[1])
 
    } else {
      arrivalTime = this.formatTimeService.formatToDisplayTime(time.toLocaleString().split(', ')[1])
      departureTime = this.formatTimeService.formatToDisplayTime(this.formatTimeService.calculateDepartureTime(time, duration))
 
    }
    let tripDisplay: TripDisplay = {
      travelDate: direction.travelDate,
      arrivalTime: arrivalTime,
      departureTime: departureTime,
      duration: duration,
      travelMode: direction.directionRequest.travelMode,
      origin: direction.directionRequest.location.originAddress,
      destination: direction.directionRequest.location.destinationAddress

    }

    return tripDisplay
  }
}
