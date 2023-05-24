import { Location } from "./google-maps-models"

export interface Direction {
    travelDate: string
    duration: number
    chosenRoute: number
    directionRequest: DirectionRequest
}

export interface DirectionRequest {
    origin: Location
    destination: Location
    location: BackendLocation
    time: Date
    travelWhen: string
    travelMode: string
}

export interface Trip {
    origin: string
    destination: string
    origin_lat: string
    origin_lng: string
    destination_lat: string
    destination_lng: string
    travelMode: string
    when: string
    time: string
}

export interface TripDisplay {
    travelDate: string
    arrivalTime: string
    departureTime: string
    duration: number
    travelMode: string
    origin: string
    destination: string
}

export interface BackendLocation {

    originAddress: string
    originLat: number
    originLng: number

    destinationAddress: string
    destinationLat: number
    destinationLng: number

}

