package auxtripper.server.main.constants;

public class UserDataSqlStatements {

        // Create
        public static final String SAVE_USER = """
                        insert into userData(username, password)
                        values(?, ?)
                        """;

        public static final String SAVE_SPOTIFY_USER = """
                        insert into spotifyUser(id, displayName, email, refreshToken, username)
                        values(?, ?, ?, ?, ?)
                        """;

        // Retrieve
        public static final String GET_USER_DATA_ID_BY_USERNAME = """
                        select id from direction where itineraryId = ?
                        """;

        public static final String GET_USER = """
                        select * from userData where id = ?
                        """;

        public static final String GET_NAME_AND_EMAIL_BY_USERNAME = """
                        select firstName, email from userData where username = ?
                        """;

        public static final String GET_SPOTIFY_USER = """
                        select * from spotifyUser where username = ?
                        """;

        public static final String GET_REFRESH_TOKEN = """
                        select refreshToken from spotifyUser where username = ?
                        """;

        public static final String SAVE_REFRESH_TOKEN = """
                        update spotifyUser set refreshToken = ?
                        where username = ?
                        """;

        public static final String UPDATE_REFRESH_TOKEN = """
                        update spotifyUser set refreshToken = ?
                        where username = ?
                        """;

}
