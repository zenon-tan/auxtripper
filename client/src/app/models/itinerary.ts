import { Direction, TripDisplay } from "./direction";
import { Playlist } from "./playlist";
import {  SpotifyUser } from "./spotify-models";

export interface Itinerary {

    direction: Direction
    playlist: Playlist
}

export interface DashboardModel {
    itinerary: any
    tripDisplay: TripDisplay
}

/*
only if user is logged in
user: string
userId: string
spotifyUser: SpotifyUser
itinerary: Itinerary
playlist: Playlist (containing PlaylistRequest)

*/

/*
if user schedules playlist creation at a later date,
store on MongoDB / Redis with the playlist Request only
store itinerary on mysql
playlist object will contain generated boolean
*/