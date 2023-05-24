package auxtripper.server.main.models;

import lombok.Data;

@Data
public class Location {

    private String originAddress;
    private float originLat;
    private float originLng;

    private String destinationAddress;
    private float destinationLat;
    private float destinationLng;
    
}
