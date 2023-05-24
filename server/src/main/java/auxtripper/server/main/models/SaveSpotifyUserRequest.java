package auxtripper.server.main.models;

import lombok.Data;

@Data
public class SaveSpotifyUserRequest {

    private SpotifyUser spotifyUser;
    private String username;
    private String refreshToken;
    
}
