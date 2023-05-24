package auxtripper.server.main.models;

import java.util.List;

import lombok.Data;

@Data
public class ModifyPlaylistRequest {
    private int dbPlaylistId;
    private String playlistId;
    private String title;
    private Boolean isPublic;
    private Boolean isCollaborative;
    private String description;
    private List<String> songs;
    private List<SpotifyTrack> tracks;
    private String imageData;
}
