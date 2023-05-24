package auxtripper.server.main.models;

import lombok.Data;

@Data
public class RefreshToken {

    private String username;
    private String refreshToken;
    
}
