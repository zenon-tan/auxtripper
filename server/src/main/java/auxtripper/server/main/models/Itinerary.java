package auxtripper.server.main.models;

import java.util.UUID;

import lombok.Data;


@Data
public class Itinerary {

    private String id;
    private Direction direction;
    private Playlist playlist;

    public Itinerary() {
        this.id = UUID.randomUUID().toString().substring(0, 8);
    }
    
}
