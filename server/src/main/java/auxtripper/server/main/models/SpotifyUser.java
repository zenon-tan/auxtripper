package auxtripper.server.main.models;

import lombok.Data;

@Data
public class SpotifyUser {
    private String displayName;
    private String id;
    private String email;
    private String refreshToken;
}
