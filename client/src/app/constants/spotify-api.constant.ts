import { Environment } from "../env/environment";
import { SpotifyVibe, Vibe } from "../models/spotify-models";
import { UserConstants } from "./user-api.constant";

export class SpotifyConstants {

    public static API_URL = UserConstants.BACKEND_URL
    public static SPOTIFY_API_URL = 'https://api.spotify.com/v1'

    public static SPOTIFY_AUTHORIZE = 'https://accounts.spotify.com/authorize?'
    public static SPOTIFY_TOKEN = 'https://accounts.spotify.com/api/token'

    public static CLIENTID = Environment.SPOTIFY_CLIENT_ID
    public static SCOPE = 'user-read-private, user-read-email, user-top-read, playlist-modify-public, playlist-modify-private, user-follow-read, ugc-image-upload'

    // public static REDIRECT_URL = 'http://localhost:4200/auth-success'
    public static REDIRECT_URL = 'https://aux.up.railway.app/auth-success'

    public static ME_URL = this.SPOTIFY_API_URL + '/me'
    public static GENRE_SEEDS_URL = this.SPOTIFY_API_URL + '/recommendations/available-genre-seeds'
    public static GET_TOP_ARTISTS = this.SPOTIFY_API_URL + '/me/top/artists'

    public static GET_TOP_TRACKS = this.SPOTIFY_API_URL + '/me/top/tracks'
    public static GET_FOLLOWED_ARTISTS = this.SPOTIFY_API_URL + '/me/following'
    public static GET_RECOMMENDATIONS = this.SPOTIFY_API_URL + '/recommendations'
    public static GET_AUDIO_FEATURES = this.SPOTIFY_API_URL + '/audio-features'

    public static LOGIN_URL = this.API_URL + '/login'
    public static REFRESH_TOKEN_URL = this.API_URL + '/get-refresh-token'


    public static CREATE_PLAYLIST = this.SPOTIFY_API_URL + '/users' // /{user_id}/playlists
    public static ADD_TO_PLAYLIST = this.SPOTIFY_API_URL + '/playlists' // /{playlist_id}/tracks
    public static GET_RELATED_ARTISTS = this.SPOTIFY_API_URL + '/artists' // /{id}/related-artists
    public static CHANGE_PLAYLIST_DETAILS = this.SPOTIFY_API_URL + '/playlists' // /{playlist_id}
    public static ADD_TO_IMG_PLAYLIST = this.SPOTIFY_API_URL + '/playlists' // /{playlist_id}/images



    public static SPOTIFY_TIME_RANGE_SHORT =

        { name: 'Last Month', value: 'short_term' }

    public static SPOTIFY_TIME_RANGE_MEDIUM =

        { name: '6 Months', value: 'medium_term' }

    public static SPOTIFY_TIME_RANGE_LONG =
        { name: 'All Time', value: 'long_term' }

    public static SPOTIFY_TIME_RANGE = [
        this.SPOTIFY_TIME_RANGE_LONG,
        this.SPOTIFY_TIME_RANGE_MEDIUM,
        this.SPOTIFY_TIME_RANGE_SHORT
    ]

    public static VIBE_WARMTH_OF_WINTER: SpotifyVibe = {
        name: 'Warmth of Winter',
        min_energy: 0.3,
        min_danceability: 0.3,
        min_liveness: 0.3,
        min_valence: 0.4,
        min_acousticness: 0.1,
        min_instrumentalness: 0.1,
        max_energy: 0.6,
        max_danceability: 0.5,
        max_liveness: 0.5,
        max_valence: 0.7,
        max_acousticness: 0.2,
        max_instrumentalness: 0.2
    }

    public static VIBE_SUMMER_SEASON: SpotifyVibe = {
        name: 'Summer Season',
        min_energy: 0.5,
        min_danceability: 0.5,
        min_liveness: 0.3,
        min_valence: 0.5,
        min_acousticness: 0.05,
        min_instrumentalness: 0.05,
        max_energy: 0.9,
        max_danceability: 0.9,
        max_liveness: 0.7,
        max_valence: 0.8,
        max_acousticness: 0.2,
        max_instrumentalness: 0.2
    }

    public static VIBE_ABSOLUTE_AUTUMN: SpotifyVibe = {
        name: 'Absolute Autumn',
        min_energy: 0.2,
        min_danceability: 0.3,
        min_liveness: 0.3,
        min_valence: 0.3,
        min_acousticness: 0.1,
        min_instrumentalness: 0.1,
        max_energy: 0.6,
        max_danceability: 0.5,
        max_liveness: 0.7,
        max_valence: 0.7,
        max_acousticness: 0.5,
        max_instrumentalness: 0.5
    }

    public static VIBE_SWEET_SPRING: SpotifyVibe = {
        name: 'Sweet Spring',
        min_energy: 0.3,
        min_danceability: 0.3,
        min_liveness: 0.3,
        min_valence: 0.5,
        min_acousticness: 0.1,
        min_instrumentalness: 0.05,
        max_energy: 0.6,
        max_danceability: 0.7,
        max_liveness: 0.7,
        max_valence: 0.8,
        max_acousticness: 0.5,
        max_instrumentalness: 0.2
    }

    public static VIBE_FEEL_GOOD: SpotifyVibe = {
        name: 'Feel Good',

        min_energy: 0.5,
        min_danceability: 0.4,
        min_liveness: 0.3,
        min_valence: 0.5,
        min_acousticness: 0.05,
        min_instrumentalness: 0.05,
        max_energy: 0.9,
        max_danceability: 0.9,
        max_liveness: 0.6,
        max_valence: 0.8,
        max_acousticness: 0.15,
        max_instrumentalness: 0.2
    }

    public static VIBE_ALONE_AGAIN: SpotifyVibe = {
        name: 'Alone Again',
        min_energy: 0.3,
        min_danceability: 0.3,
        min_liveness: 0.5,
        min_valence: 0.3,
        min_acousticness: 0.1,
        min_instrumentalness: 0.3,
        max_energy: 0.5,
        max_danceability: 0.3,
        max_liveness: 0.7,
        max_valence: 0.5,
        max_acousticness: 0.6,
        max_instrumentalness: 0.6
    }

    public static VIBE_MUSIC_AND_CHILL: SpotifyVibe = {
        name: 'Music and Chill',
        min_energy: 0.3,
        min_danceability: 0.3,
        min_liveness: 0.3,
        min_valence: 0.5,
        min_acousticness: 0.1,
        min_instrumentalness: 0.3,
        max_energy: 0.5,
        max_danceability: 0.6,
        max_liveness: 0.7,
        max_valence: 0.8,
        max_acousticness: 0.5,
        max_instrumentalness: 0.2
    }

    public static VIBE_DAYBREAK: SpotifyVibe = {
        name: 'Daybreak',

        min_energy: 0.5,
        min_danceability: 0.3,
        min_liveness: 0.1,
        min_valence: 0.5,
        min_acousticness: 0.05,
        min_instrumentalness: 0.05,
        max_energy: 0.8,
        max_danceability: 0.6,
        max_liveness: 0.5,
        max_valence: 0.8,
        max_acousticness: 0.2,
        max_instrumentalness: 0.2
    }

    public static VIBE_MORNING_RYTHMN: SpotifyVibe = {
        name: 'Morning Rythmn',
        min_energy: 0.3,
        min_danceability: 0.4,
        min_liveness: 0.1,
        min_valence: 0.5,
        min_acousticness: 0.05,
        min_instrumentalness: 0.05,
        max_energy: 0.6,
        max_danceability: 0.7,
        max_liveness: 0.2,
        max_valence: 0.9,
        max_acousticness: 0.2,
        max_instrumentalness: 0.15
    }

    public static VIBE_MIDNIGHT_TRAIN: SpotifyVibe = {
        name: 'Midnight Train',
        min_energy: 0.1,
        min_danceability: 0.1,
        min_liveness: 0.2,
        min_valence: 0.3,
        min_acousticness: 0.3,
        min_instrumentalness: 0.3,
        max_energy: 0.5,
        max_danceability: 0.3,
        max_liveness: 0.5,
        max_valence: 0.6,
        max_acousticness: 0.6,
        max_instrumentalness: 0.6
    }

    public static VIBE_NEON_LIGHTS: SpotifyVibe = {
        name: 'Neon Lights',

        min_energy: 0.5,
        min_danceability: 0.5,
        min_liveness: 0.2,
        min_valence: 0.5,
        min_acousticness: 0.05,
        min_instrumentalness: 0.05,
        max_energy: 1,
        max_danceability: 1,
        max_liveness: 0.7,
        max_valence: 1,
        max_acousticness: 0.15,
        max_instrumentalness: 0.15
    }

    public static VIBES_SEASON: SpotifyVibe[] = [
        this.VIBE_SWEET_SPRING, this.VIBE_SUMMER_SEASON,
        this.VIBE_ABSOLUTE_AUTUMN, this.VIBE_WARMTH_OF_WINTER
    ]

    public static VIBES_MOOD: SpotifyVibe[] = [
        this.VIBE_FEEL_GOOD, this.VIBE_ALONE_AGAIN, this.VIBE_MUSIC_AND_CHILL
    ]

    public static VIBES_DAY: SpotifyVibe[] = [
        this.VIBE_DAYBREAK, this.VIBE_MORNING_RYTHMN, this.VIBE_MIDNIGHT_TRAIN, this.VIBE_NEON_LIGHTS
    ]

    public static VIBES_ALL: SpotifyVibe[] = [
        this.VIBE_SWEET_SPRING, this.VIBE_SUMMER_SEASON,
        this.VIBE_ABSOLUTE_AUTUMN, this.VIBE_WARMTH_OF_WINTER,
        this.VIBE_FEEL_GOOD, this.VIBE_ALONE_AGAIN, this.VIBE_MUSIC_AND_CHILL,
        this.VIBE_DAYBREAK, this.VIBE_MORNING_RYTHMN, this.VIBE_MIDNIGHT_TRAIN, this.VIBE_NEON_LIGHTS

    ]

}

