package auxtripper.server.main.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import auxtripper.server.main.models.SpotifyUser;
import auxtripper.server.main.models.UserDataEmailRequest;
import auxtripper.server.main.repositories.UserDataRepository;

@Service
public class UserDataService {

    @Autowired
    UserDataRepository userDataRepository;

    public void saveSpotifyUser(SpotifyUser spotifyUser, String refreshToken, String username) {
        userDataRepository.saveSpotifyUser(spotifyUser, refreshToken, username);
    }

    public Optional<SpotifyUser> getSpotifyUserByUsername(String username) {
        return userDataRepository.getSpotifyUserByUsername(username);
    }

    public Boolean ifUserHasSpotifyUser(String username) {
        return userDataRepository.ifUserHasSpotifyUser(username);
    }

    public void saveRefreshToken(String refreshToken, String username) {
        userDataRepository.saveRefreshToken(refreshToken, username);
    }

    public String getRefreshToken(String username) {
        return userDataRepository.getRefreshToken(username);
    }

    public Boolean updateRefreshToken(String refreshToken, String username) {
        return userDataRepository.updateRefreshToken(refreshToken, username);
    }

    public UserDataEmailRequest getEmailAndNameByUsername(String username) {
        return userDataRepository.getEmailAndNameByUsername(username);
    }

    
}
