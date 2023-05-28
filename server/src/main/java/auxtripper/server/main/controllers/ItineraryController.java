package auxtripper.server.main.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.apache.el.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import auxtripper.server.main.models.Itinerary;
import auxtripper.server.main.models.ModifyPlaylistRequest;
import auxtripper.server.main.services.ItineraryService;

@RestController
@RequestMapping(path = "/itinerary/api")
// @CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", allowCredentials = "true")
public class ItineraryController {

    @Autowired
    ItineraryService itineraryService;

    @PostMapping(path = "/save")
    public ResponseEntity<String> saveItinerary(@RequestBody Itinerary itinerary) {
        itinerary.setId(UUID.randomUUID().toString().substring(0, 8));
        itineraryService.saveData(itinerary);
        JsonObject response = Json.createObjectBuilder().add("id", itinerary.getId()).build();
        return ResponseEntity.ok(response.toString());
    }

    @GetMapping(path = "/all")
    public List<Itinerary> getAllItinerariesByUser(@RequestParam(name = "username") String username) {
        Optional<List<Itinerary>> result = itineraryService.getAllItineraries(username);
        if(result.isPresent()) {
            return result.get();
        }
        return new ArrayList<>();

    }

    @GetMapping(path = "/itinerary")
    public Itinerary getItineraryById(@RequestParam(name = "id") String itineraryId) {
        Optional<Itinerary> result = itineraryService.getItineraryById(itineraryId);
        if(result.isPresent()) {
            return result.get();
        }
        return new Itinerary();
    }

    @PostMapping(path = "/modifyPlaylist")
    public void modifyPlaylist(@RequestBody ModifyPlaylistRequest modifyPlaylistRequest) throws ParseException, IOException {
        itineraryService.modifyPlaylist(modifyPlaylistRequest);
    }

    @GetMapping(path = "/delete")
    public void deleteItinerary(@RequestParam(name = "id") String itineraryId) {
        itineraryService.deleteItineraryById(itineraryId);
    }

}
