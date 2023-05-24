package auxtripper.server.authentication.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import auxtripper.server.authentication.configs.JwtService;
import auxtripper.server.authentication.models.AuthenticationRequest;
import auxtripper.server.authentication.models.AuthenticationResponse;
import auxtripper.server.authentication.models.RegisterRequest;
import auxtripper.server.authentication.models.User;
import auxtripper.server.authentication.repositories.UserRepo;
import auxtripper.server.main.services.UserDataService;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Autowired
    UserRepo uRepo;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtService jwtService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserDataService userDataService;

    public AuthenticationResponse register(RegisterRequest request) {

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        uRepo.insertNewUser(user);
        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .role(user.getRole())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        var user = uRepo.findByUsername(request.getUsername())
                .orElseThrow();

        SecurityContextHolder.getContext().setAuthentication(authentication);

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .username(request.getUsername())
                .token(jwtToken)
                .build();
    }

    public String getCurrentUser() {
        return ((UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

    }

}
