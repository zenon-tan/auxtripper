import { Injectable } from '@angular/core';
import { Distance, Duration, Legs, Line, Routes, Steps, StopTiming, Timing, Transit, Vehicle } from '../models/google-maps-models';

@Injectable({
  providedIn: 'root'
})
export class GoogleRouteService {

  routes: Routes[] = []
  legs: Legs[] = []
  timing!: Timing
  steps: Steps[] = []
  transit!: Transit
  line!: Line
  vehicle!: Vehicle

  constructor() { }

  createRouteObject(response: any) {

    let allRoutes: Routes[] = []

    for (let h of response.routes) {

      let summary = h.summary as string
      let routes!: Routes
      let legsArray: Legs[] = []
      for (let i of h.legs) {

        let distance = i.distance as Distance
        let duration = i.duration as Duration
        let start_address = i.start_address as string
        let end_address = i.end_address as string
        let legs!: Legs
        let steps: Steps[] = []
        let arrival_time = i.arrival_time as Timing
        let departure_time = i.departure_time as Timing


        for (let j of i.steps) {
          let jdistance = j.distance as Distance
          let jduration = j.duration as Duration
          let jtravel_mode = j.travel_mode as string
          let jinstructions = j.instructions as string
          let jtransit!: Transit
          let jstep!: Steps
          let jarrival_time!: StopTiming
          let jdeparture_time!: StopTiming
          let num_stops: number
          let jarrival_stop!: string
          let jdeparture_stop!: string
          let jline!: Line

          if (jtravel_mode == 'TRANSIT') {

            jarrival_time = j.transit.arrival_time as StopTiming
            jdeparture_time = j.transit.departure_time as StopTiming
            num_stops = j.transit.num_stops as number
            jarrival_stop = j.transit.arrival_stop.name as string
            jdeparture_stop = j.transit.departure_stop.name as string
            jline = j.transit.line as Line

            jtransit = {
              arrival_stop: jarrival_stop,
              departure_stop: jdeparture_stop,
              arrival_time: jarrival_time,
              departure_time: jdeparture_time,
              line: jline,
              num_stops: num_stops

            }

          }

          jstep = {
            distance: jdistance,
            duration: jduration,
            travel_mode: jtravel_mode,
            instructions: jinstructions,
            transit: jtransit

          }

          steps.push(jstep)

        }

        legs = {
          arrival_time: arrival_time,
          departure_time: departure_time,
          distance: distance,
          duration: duration,
          end_address: end_address,
          start_address: start_address,
          steps: steps
        }
        legsArray.push(legs)
      }
      routes = {
        summary: summary,
        legs: legsArray
      }

      allRoutes.push(routes)
    }
    return allRoutes
  }

}
