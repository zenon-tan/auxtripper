import { Direction, TripDisplay } from "./direction";
import { Playlist } from "./playlist";

export interface Itinerary {

    direction: Direction
    playlist: Playlist
}

export interface DashboardModel {
    itinerary: any
    tripDisplay: TripDisplay
}
