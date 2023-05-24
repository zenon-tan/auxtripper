package auxtripper.server.main.constants;

public class ItinerarySqlStatements {

        // Create

        public static final String SAVE_ITINERARY = """
                        insert into itinerary(id, spotifyId)
                        values(?, ?)
                        """;

        public static final String SAVE_DIRECTION = """
                        insert into direction(chosenRoute, duration, travelDate, itineraryId)
                        values(?, ?, ?, ?)
                        """;

        public static final String SAVE_DIRECTION_REQUEST = """
                        insert into directionRequest(time, travelWhen, travelMode, directionId)
                        values(?, ?, ?, ?)
                        """;

        public static final String SAVE_LOCATION = """
                        insert into location(originAddress, originLat, originLng, destinationAddress, destinationLat, destinationLng, directionRequestId)
                        values(?, ?, ?, ?, ?, ?, ?)
                        """;

        public static final String SAVE_PLAYLIST = """
                        insert into playlist(playlistId, itineraryId)
                        values(?, ?)
                        """;

        public static final String SAVE_PLAYLIST_REQUEST = """
                        insert into playlistRequest(title, isPublic, isCollaborative, description, imageData, playlistId)
                        values(?, ?, ?, ?, ?, ?)
                        """;

        public static final String SAVE_GENRE = """
                        insert into genres(name, playlistId)
                        values(?, ?)
                        """;

        public static final String SAVE_TRACK = """
                        insert into tracks(trackId, title, playlistId)
                        values(?, ?, ?)
                        """;

        public static final String SAVE_ARTIST = """
                        insert into artists(name, artistId, playlistId)
                        values(?, ?, ?)
                        """;

        public static final String SAVE_VIBE = """
                        insert into vibes(name, energy, danceability, loudness, liveness, valence, playlistId)
                        values(?, ?, ?, ?, ?, ?, ?)
                        """;

        // Retrieve

        public static final String GET_DIRECTION_ID_BY_ITINERARY_ID = """
                        select id from direction where itineraryId = ?
                        """;

        public static final String GET_DIRECTION_REQUEST_ID_BY_DIRECTION_ID = """
                        select id from directionRequest where directionId = ?
                        """;

        public static final String GET_PLAYLIST_ID_BY_ITINERARY_ID = """
                        select id from playlist where itineraryId = ?
                        """;

        public static final String GET_SPOTIFY_PLAYLIST_ID_BY_ITINERARY_ID = """
                        select playlistId from playlist where itineraryId = ?
                        """;

        public static final String GET_SPOTIFYID_BY_USERNAME = """
                        select id from spotifyUser where username = ?
                        """;

        public static final String GET_ITINERARY = """
                        select * from itinerary where spotifyId = ?
                        """;

        public static final String GET_PLAYLIST = """
                        select * from playlist where itineraryId = ?
                        """;

        public static final String GET_PLAYLIST_REQUEST = """
                        select * from playlistRequest where playlistId = ?
                        """;

        public static final String GET_GENRES = """
                        select name from genres where playlistId = ?
                        """;

        public static final String GET_TRACKS = """
                        select * from tracks where playlistId = ?
                        """;

        public static final String GET_ARTISTS = """
                        select * from artists where playlistId = ?
                        """;

        public static final String GET_VIBE = """
                        select * from vibes where playlistId = ?
                        """;

        public static final String GET_DIRECTION = """
                        select * from direction where itineraryId = ?
                        """;

        public static final String GET_DIRECTION_REQUEST = """
                        select * from directionRequest where directionId = ?
                        """;

        public static final String GET_LOCATION = """
                        select * from location where directionRequestId = ?
                        """;

        public static final String GET_ITINERARY_BY_ITINERARY_ID = """
                        select * from itinerary where id = ?
                        """;

                        public static final String GET_PLAYLIST_ID_BY_PLAYLIST_REQUEST_ID = """
                                select playlistId from playlistRequest where id = ?
                                """;
        // Update

        public static final String UPDATE_PLAYLIST_REQUEST = """
                        update playlistRequest
                        set title = ?, description = ?, isPublic = ?, isCollaborative = ?, imageData = ?
                        where id = ?
                        """;


        public static final String UPDATE_TRACKS = """
                        update tracks
                        set trackId = ?, title = ?
                        where playlistId = ?
                        """;

        // Delete

        public static final String DELETE_ITINERARY_BY_ID = """
            delete from itinerary where id = ?
            """;

            public static final String DELETE_TRACKS_BY_PLAYLISTID = """
            delete from tracks where playlistId = ?
            """;
}
