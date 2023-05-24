package auxtripper.server.main.models;

import java.util.List;

import lombok.Data;

@Data
public class Playlist {

    private List<String> genres;
    private List<SpotifyTrack> tracks;
    private List<SpotifyArtist> artists;
    private SpotifyVibe vibe;
    private PlaylistRequest playlistRequest;
    private String playlistId;
    
}
