package auxtripper.server.main.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import auxtripper.server.main.models.SpotifyUser;
import auxtripper.server.main.models.UserDataEmailRequest;

import static auxtripper.server.main.constants.UserDataSqlStatements.*;

import java.util.List;
import java.util.Optional;

@Repository
public class UserDataRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;
    
    public void saveSpotifyUser(SpotifyUser spotifyUser, String refreshToken, String username) {
        jdbcTemplate.update(SAVE_SPOTIFY_USER, spotifyUser.getId(), spotifyUser.getDisplayName(), spotifyUser.getEmail(), refreshToken, username);
    }

    public Optional<SpotifyUser> getSpotifyUserByUsername(String username) {
        try {
            List<SpotifyUser> result = jdbcTemplate.query(GET_SPOTIFY_USER, new BeanPropertyRowMapper().newInstance(SpotifyUser.class), username);
            if(result.size() > 0) {
                return Optional.of(result.get(0));
            }
            return Optional.empty();
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public void saveRefreshToken(String refreshToken, String username) {
        jdbcTemplate.update(SAVE_REFRESH_TOKEN, refreshToken, username);
    }

    public String getRefreshToken(String username) {
        return jdbcTemplate.queryForObject(GET_REFRESH_TOKEN, String.class, username);
    }

    public Boolean ifUserHasSpotifyUser(String username) {
        List<SpotifyUser> result = jdbcTemplate.query(GET_SPOTIFY_USER, new BeanPropertyRowMapper().newInstance(SpotifyUser.class), username);
        if(result.size() > 0) {
            return true;
        }
        return false;
    }

    public Boolean updateRefreshToken(String refreshToken, String username) {
        return jdbcTemplate.update(SAVE_REFRESH_TOKEN, refreshToken, username) > 0;
    }

    public UserDataEmailRequest getEmailAndNameByUsername(String username) {
        return jdbcTemplate.query(GET_NAME_AND_EMAIL_BY_USERNAME, new BeanPropertyRowMapper().newInstance(UserDataEmailRequest.class), username).get(0);
    }
    
}
