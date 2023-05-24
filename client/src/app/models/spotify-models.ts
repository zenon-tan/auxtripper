export interface SpotifyUser {
    displayName: string
    email: string
    id: string
}

export interface SaveSpotifyUserRequest {
    spotifyUser: SpotifyUser
    username: string
    refreshToken: string
}

export interface Artist {
    name: string
    artistId: string
    href: string
    genres: string[]
    uri: string
    images: Image[]
}

export interface TrackArtist {
    name: string
    href: string
    uri: string
}

export interface Track {
    title: string
    trackId: string
    durationMs: number
    href: string
    iFrameUrl: string
    artists: TrackArtist[]
    uri: string
}

export interface Image {
    url: string
    height: number
    width: number
}

export interface Album {
    name: string
    id: string
    href: string
    images: Image[]
}

export interface Vibe {
    name: string
    energy: number
    danceability: number
    loudness: number
    liveness: number
    valence: number
    totalDuration: number
}

export interface SpotifyVibe {
    name: string
    min_energy: number
    min_danceability: number
    min_liveness: number
    min_valence: number
    min_acousticness: number
    min_instrumentalness: number
    max_energy: number
    max_danceability: number
    max_liveness: number
    max_valence: number
    max_acousticness: number
    max_instrumentalness: number
}

