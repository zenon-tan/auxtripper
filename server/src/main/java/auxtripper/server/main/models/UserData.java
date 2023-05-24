package auxtripper.server.main.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserData {
    private UserProfile userProfile;
    private SpotifyUser spotifyUser;
}
