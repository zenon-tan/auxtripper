export class UserConstants {

    // public static BACKEND_URL = 'http://localhost:8080'
    public static BACKEND_URL = ''
    public static WEBSITE_URL = 'https://aux.up.railway.app'
    public static ITINERARY_API = this.BACKEND_URL + '/itinerary/api'
    public static USER_DATA_API = this.BACKEND_URL + '/userData/api'
    public static AUTH_API = this.BACKEND_URL + '/api/auth/'

    public static ITINERARY_SAVE = this.ITINERARY_API + '/save'
    public static USER_DATA_SAVE = this.USER_DATA_API + '/save'
    public static SPOTIFY_USER_SAVE = this.USER_DATA_API + '/saveSpotifyUser'
    public static SPOTIFY_USER_EXISTS = this.USER_DATA_API + '/spotifyUserExists'
    public static GET_SPOTIFY_USER = this.USER_DATA_API + '/getSpotifyUser'
    public static GET_USER_ITINERARIES = this.ITINERARY_API + '/all'
    public static GET_ITINERARY_BY_ID = this.ITINERARY_API + '/itinerary'
    public static DELETE_ITINERARY_BY_ID = this.ITINERARY_API + '/delete'
    public static MODIFY_PLAYLIST_REQUEST = this.ITINERARY_API + '/modifyPlaylist'
    public static UPDATE_REFRESH_TOKEN = this.USER_DATA_API + '/updateRefreshToken'
    public static GET_CURRENT_USER = this.USER_DATA_API + '/getCurrentUser'
    public static GET_USER_EMAIL = this.USER_DATA_API + '/userEmail'
    public static SEND_EMAIL = this.USER_DATA_API + '/scheduleEmail'
}