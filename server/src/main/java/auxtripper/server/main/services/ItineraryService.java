package auxtripper.server.main.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import auxtripper.server.main.models.Direction;
import auxtripper.server.main.models.DirectionRequest;
import auxtripper.server.main.models.Itinerary;
import auxtripper.server.main.models.Location;
import auxtripper.server.main.models.ModifyPlaylistRequest;
import auxtripper.server.main.models.Playlist;
import auxtripper.server.main.models.PlaylistRequest;
import auxtripper.server.main.models.SpotifyArtist;
import auxtripper.server.main.models.SpotifyTrack;
import auxtripper.server.main.repositories.ItineraryRepository;

@Service
public class ItineraryService {

    @Autowired
    ItineraryRepository iRepo;

    @Transactional
    public void saveData(Itinerary itinerary) {

        iRepo.saveItinerary(itinerary);

    }

    public Optional<List<Itinerary>> getAllItineraries(String username) {
        Optional<String> spotifyId = iRepo.getSpotifyIdWithUsername(username);
        if (spotifyId.isPresent()) {

            // System.out.println(spotifyId.get());

            Optional<List<Itinerary>> itineraries = iRepo.getItineraries(spotifyId.get());

            if(itineraries.isPresent()) {

                // System.out.println(itineraries);
                List<Itinerary> results = new ArrayList<>();
                itineraries.get().stream().forEach(
                        i -> {
                            String itineraryId = i.getId();
                            results.add(getItineraryById(itineraryId).get());
                        });
    
                return Optional.of(results);

            }

            return Optional.empty();
        }

        return Optional.empty();

    }

    public Optional<Itinerary> getItineraryById(String itineraryId) {

        Itinerary itinerary = new Itinerary();
        itinerary.setId(itineraryId);
        int playlistId;

        try {
            playlistId = iRepo.getPlaylistId(itineraryId);
        } catch (Exception e) {
            return Optional.empty();
        }
        String spotifyPlaylistId = iRepo.getSpotifyPlaylistId(itineraryId);
        List<SpotifyArtist> artists = iRepo.getArtists(playlistId);
        List<SpotifyTrack> tracks = iRepo.getTracks(playlistId);
        PlaylistRequest playlistRequest = iRepo.getPlaylistRequest(playlistId);

        String[] songs = new String[tracks.size()];

        for (int j = 0; j < tracks.size(); j++) {
            songs[j] = "spotify:track:" + tracks.get(j).getTrackId();
        }

        playlistRequest.setSongs(songs);

        List<String> genres = iRepo.getGenres(playlistId);

        Playlist playlist = new Playlist();
        playlist.setArtists(artists);
        playlist.setPlaylistRequest(playlistRequest);
        playlist.setTracks(tracks);
        playlist.setGenres(genres);
        playlist.setPlaylistId(spotifyPlaylistId);

        Direction direction = iRepo.getDirection(itineraryId);
        int directionId = iRepo.getDirectionId(itineraryId);
        DirectionRequest directionRequest = iRepo.getDirectionRequest(directionId);
        int directionRequestId = iRepo.getDirectionRequestId(directionId);
        Location location = iRepo.getLocation(directionRequestId);

        directionRequest.setLocation(location);
        direction.setDirectionRequest(directionRequest);

        itinerary.setDirection(direction);
        itinerary.setPlaylist(playlist);
        return Optional.of(itinerary);

    }

    public void deleteItineraryById(String itineraryId) {
        iRepo.deleteItineraryById(itineraryId);
    }

    public void modifyPlaylist(ModifyPlaylistRequest modifyPlaylistRequest)
            throws IOException {

        // spotifyService.updatePlaylistDetails(modifyPlaylistRequest);
        List<SpotifyTrack> oldTracks = iRepo.getTracks(modifyPlaylistRequest.getDbPlaylistId());
        List<String> songs = new ArrayList<>();

        oldTracks.stream().forEach(
                t -> {
                    songs.add(t.getTrackId());
                });

        int dbPlaylistId = iRepo.getPlaylistIdFromPlaylistRequestId(modifyPlaylistRequest.getDbPlaylistId());
        iRepo.deleteTracks(dbPlaylistId);
        iRepo.addTracks(modifyPlaylistRequest.getTracks(), dbPlaylistId);
        iRepo.updatePlaylistRequest(modifyPlaylistRequest);

    }

}
