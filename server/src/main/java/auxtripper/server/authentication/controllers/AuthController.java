package auxtripper.server.authentication.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import auxtripper.server.authentication.models.AuthenticationRequest;
import auxtripper.server.authentication.models.AuthenticationResponse;
import auxtripper.server.authentication.models.RegisterRequest;
import auxtripper.server.authentication.services.AuthService;

@RestController
@RequestMapping(path = "/api/auth")
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", allowCredentials = "true")
// @CrossOrigin(origins = "https://auxtripper.up.railway.app", allowedHeaders = "*", allowCredentials = "true")
// @CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService aSrc;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(aSrc.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(aSrc.authenticate(request));
    }

}
