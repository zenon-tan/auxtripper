import { Artist, Track, Vibe } from "./spotify-models"

export interface Playlist {
    playlistId: string
    playlistRequest: PlaylistRequest
    artists: Artist[]
    tracks: Track[]
    genres: string[]
    isCreated: boolean
    createdOn: Date
    vibe: Vibe
}

export interface PlaylistRequest {
    id: string
    title: string
    isPublic: boolean
    isCollaborative: boolean
    description: string
    songs: string[]
    imageData: string
}

export interface ModifyPlaylistRequest {
    dbPlaylistId: number
    playlistId: string
    title: string
    isPublic: boolean
    isCollaborative: boolean
    description: string
    songs: string[]
    tracks: Track[]
    imageData: string
}