package auxtripper.server.main.models;

import lombok.Data;

@Data
public class Direction {

    private int chosenRoute;
    private DirectionRequest directionRequest;
    private int duration;
    private String travelDate;
    
}
