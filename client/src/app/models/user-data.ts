import { SpotifyUser } from "./spotify-models";

export interface UserData {

    spotifyUser: SpotifyUser

}

export interface UserProfile {

}

export interface EmailRequest {
    email: string
    subject: string
    body: string
    dateTime: string
    timeZone: string
}