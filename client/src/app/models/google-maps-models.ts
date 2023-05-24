export interface Routes {

    summary: string
    legs: Legs[]
}

export interface Legs {

    arrival_time: Timing
    departure_time: Timing
    distance: Distance
    duration: Duration
    end_address: string
    start_address: string
    steps: Steps[]
}

export interface Timing {
    text: string
    time_zone: string
    value: number
}

export interface Distance {
    text: string
    value: number
}

export interface Duration {
    text: string
    value: number
}

export interface StartAddress {
    end_address: string
    location: Location
}

export interface EndAddress {
    end_address: string
    location: Location
}

export interface Location {
    address: string
    latlng: google.maps.LatLngLiteral
}

export interface Steps {

    distance: Distance
    duration: Duration
    travel_mode: string
    instructions: string
    transit: Transit

}

export interface Transit {
    arrival_stop: string
    departure_stop: string
    arrival_time: StopTiming
    departure_time: StopTiming
    line: Line
    num_stops: number
}

export interface Line {
    color: string
    name: string
    text_color: string
    vehicle: Vehicle
}

export interface StopTiming {
    text: string
    time_zone: string
    value: string
}


export interface Vehicle {

    icon: string
    name: string
    type: string

}

export interface Bound {
    north: number
    south: number
    east: number
    west: number
}