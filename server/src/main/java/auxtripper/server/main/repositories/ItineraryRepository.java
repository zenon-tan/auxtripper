package auxtripper.server.main.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import static auxtripper.server.main.constants.ItinerarySqlStatements.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import auxtripper.server.main.models.PlaylistRequest;
import auxtripper.server.main.models.Direction;
import auxtripper.server.main.models.DirectionRequest;
import auxtripper.server.main.models.Itinerary;
import auxtripper.server.main.models.Location;
import auxtripper.server.main.models.ModifyPlaylistRequest;
import auxtripper.server.main.models.Playlist;
import auxtripper.server.main.models.SpotifyArtist;
import auxtripper.server.main.models.SpotifyTrack;

@Repository
public class ItineraryRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Transactional
    public void saveItinerary(Itinerary itinerary) {
        Direction direction = itinerary.getDirection();
        DirectionRequest directionRequest = direction.getDirectionRequest();
        Location location = directionRequest.getLocation();

        Playlist playlist = itinerary.getPlaylist();
        PlaylistRequest playlistRequest = playlist.getPlaylistRequest();
        List<SpotifyArtist> artists = playlist.getArtists();
        List<SpotifyTrack> tracks = playlist.getTracks();
        List<String> genres = playlist.getGenres();

        jdbcTemplate.update(SAVE_ITINERARY, itinerary.getId(), itinerary.getPlaylist().getPlaylistRequest().getId());
        jdbcTemplate.update(SAVE_DIRECTION, direction.getChosenRoute(), direction.getDuration(),
                direction.getTravelDate(), itinerary.getId());

        Integer directionId = jdbcTemplate.queryForObject(GET_DIRECTION_ID_BY_ITINERARY_ID, Integer.class,
                itinerary.getId());

        jdbcTemplate.update(SAVE_DIRECTION_REQUEST, directionRequest.getTime(), directionRequest.getTravelWhen(),
                directionRequest.getTravelMode(), directionId);

        Integer directionReQuestId = jdbcTemplate.queryForObject(GET_DIRECTION_REQUEST_ID_BY_DIRECTION_ID,
                Integer.class, directionId);
        jdbcTemplate.update(SAVE_LOCATION, location.getOriginAddress(), location.getOriginLat(),
                location.getOriginLng(),
                location.getDestinationAddress(), location.getDestinationLat(), location.getDestinationLng(),
                directionReQuestId);

        jdbcTemplate.update(SAVE_PLAYLIST, playlist.getPlaylistId(), itinerary.getId());
        Integer playlist_id = jdbcTemplate.queryForObject(GET_PLAYLIST_ID_BY_ITINERARY_ID, Integer.class,
                itinerary.getId());
        jdbcTemplate.update(SAVE_PLAYLIST_REQUEST, playlistRequest.getTitle(), playlistRequest.getIsPublic(),
                playlistRequest.getIsCollaborative(),
                playlistRequest.getDescription(), playlistRequest.getImageData(), playlist_id);

        List<Object[]> artistsArr = new ArrayList<>();
        List<Object[]> tracksArr = new ArrayList<>();
        List<Object[]> genresArr = new ArrayList<>();

        artists.stream().forEach(
                a -> {
                    Object[] obj = new Object[3];
                    obj[0] = a.getName();
                    obj[1] = a.getArtistId();
                    obj[2] = playlist_id;
                    artistsArr.add(obj);
                });

        tracks.stream().forEach(
                t -> {
                    Object[] obj = new Object[3];
                    obj[0] = t.getTrackId();
                    obj[1] = t.getTitle();
                    obj[2] = playlist_id;
                    tracksArr.add(obj);
                });

        genres.stream().forEach(
                g -> {
                    Object[] obj = new Object[2];
                    obj[0] = g;
                    obj[1] = playlist_id;
                    genresArr.add(obj);
                });

        jdbcTemplate.batchUpdate(SAVE_ARTIST, artistsArr);
        jdbcTemplate.batchUpdate(SAVE_TRACK, tracksArr);
        jdbcTemplate.batchUpdate(SAVE_GENRE, genresArr);

    }

    public void addTracks(Playlist playlist) {
        List<Object[]> tracksArr = new ArrayList<>();
        List<SpotifyTrack> tracks = playlist.getTracks();

        tracks.stream().forEach(
                t -> {
                    Object[] obj = new Object[3];
                    obj[0] = t.getTrackId();
                    obj[1] = t.getTitle();
                    obj[2] = playlist.getPlaylistId();
                    tracksArr.add(obj);
                });
                jdbcTemplate.batchUpdate(SAVE_TRACK, tracksArr);
    }

    public void addTracks(List<SpotifyTrack> tracks, int dbPlaylistId) {
        List<Object[]> tracksArr = new ArrayList<>();

        tracks.stream().forEach(
                t -> {
                    Object[] obj = new Object[3];
                    obj[0] = t.getTrackId();
                    obj[1] = t.getTitle();
                    obj[2] = dbPlaylistId;
                    tracksArr.add(obj);
                });

                jdbcTemplate.batchUpdate(SAVE_TRACK, tracksArr);
    }

    public Optional<String> getSpotifyIdWithUsername(String username) {
        String spotifyId = "";
        try {
            spotifyId = jdbcTemplate.queryForObject(GET_SPOTIFYID_BY_USERNAME, String.class, username);
        } catch (EmptyResultDataAccessException e) {
        System.out.println("user does not exist");
        return Optional.empty();
        }
        return Optional.of(spotifyId);
    }

    public Optional<List<Itinerary>> getItineraries(String spotifyId) {
        try {
            List<Itinerary> itineraries = jdbcTemplate.query(GET_ITINERARY,
            new BeanPropertyRowMapper().newInstance(Itinerary.class), spotifyId);

            if(itineraries.size() > 0) {
                return Optional.of(itineraries);
            }
            return Optional.empty();

        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public int getPlaylistId(String itineraryId) {
        return jdbcTemplate.queryForObject(GET_PLAYLIST_ID_BY_ITINERARY_ID, Integer.class,
        itineraryId);
    }

    public String getSpotifyPlaylistId(String itineraryId) {
        return jdbcTemplate.queryForObject(GET_SPOTIFY_PLAYLIST_ID_BY_ITINERARY_ID,
        String.class, itineraryId);
    }

    public List<SpotifyArtist> getArtists(int playlistId) {
        return jdbcTemplate.query(GET_ARTISTS,
        new BeanPropertyRowMapper().newInstance(SpotifyArtist.class), playlistId);
    }

    public List<SpotifyTrack> getTracks(int playlistId) {
        return jdbcTemplate.query(GET_TRACKS,
        new BeanPropertyRowMapper().newInstance(SpotifyTrack.class), playlistId);
    }

    public PlaylistRequest getPlaylistRequest(int playlistId) {
        return jdbcTemplate.query(GET_PLAYLIST_REQUEST,
        new BeanPropertyRowMapper().newInstance(PlaylistRequest.class), playlistId).get(0);
    }

    public int getPlaylistIdFromPlaylistRequestId(int playlistRequestId) {
        return jdbcTemplate.queryForObject(GET_PLAYLIST_ID_BY_PLAYLIST_REQUEST_ID, Integer.class, playlistRequestId);
    }

    public List<String> getGenres(int playlistId) {
        return jdbcTemplate.queryForList(GET_GENRES, String.class, playlistId);
    }

    public Direction getDirection(String itineraryId) {
        return jdbcTemplate.query(GET_DIRECTION,
        new BeanPropertyRowMapper().newInstance(Direction.class), itineraryId).get(0);
    }

    public int getDirectionId(String itineraryId) {
        return jdbcTemplate.queryForObject(GET_DIRECTION_ID_BY_ITINERARY_ID, Integer.class,
        itineraryId);
    }

    public DirectionRequest getDirectionRequest(int directionId) {
        return jdbcTemplate.query(GET_DIRECTION_REQUEST,
        new BeanPropertyRowMapper().newInstance(DirectionRequest.class), directionId).get(0);
    }

    public int getDirectionRequestId(int directionId) {
        return jdbcTemplate.queryForObject(GET_DIRECTION_REQUEST_ID_BY_DIRECTION_ID,
        Integer.class, directionId);
    }

    public Location getLocation(int directionRequestId) {
        return jdbcTemplate.query(GET_LOCATION,
        new BeanPropertyRowMapper().newInstance(Location.class), directionRequestId).get(0);
    }


    public void deleteTracks(int playlistId) {
        jdbcTemplate.update(DELETE_TRACKS_BY_PLAYLISTID, playlistId);

    }

    public void deleteItineraryById(String itineraryId) {
        jdbcTemplate.update(DELETE_ITINERARY_BY_ID, itineraryId);
    }

    public void updatePlaylistRequest(ModifyPlaylistRequest playlistRequest) {
        jdbcTemplate.update(UPDATE_PLAYLIST_REQUEST, playlistRequest.getTitle(), playlistRequest.getDescription(), 
        playlistRequest.getIsPublic(), playlistRequest.getIsCollaborative(), playlistRequest.getImageData(), playlistRequest.getDbPlaylistId());
    }



}
