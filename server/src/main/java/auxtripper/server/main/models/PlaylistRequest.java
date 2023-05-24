package auxtripper.server.main.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistRequest {
    private String id;
    private String title;
    private Boolean isPublic;
    private Boolean isCollaborative;
    private String description;
    private String imageData;
    private String[] songs;
}
