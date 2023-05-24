package auxtripper.server.main.models;

import lombok.Data;

@Data
public class DirectionRequest {

    private Location location;
    private String time;
    private String travelWhen;
    private String travelMode;
}
