package auxtripper.server.main.controllers;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.quartz.JobBuilder;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.validation.Valid;
import auxtripper.server.authentication.services.AuthService;
import auxtripper.server.main.models.RefreshToken;
import auxtripper.server.main.models.SaveSpotifyUserRequest;
import auxtripper.server.main.models.SpotifyUser;
import auxtripper.server.main.models.UserData;
import auxtripper.server.main.models.UserDataEmailRequest;
import auxtripper.server.quartz.controller.EmailJobScheduleController;
import auxtripper.server.quartz.job.EmailJob;
import auxtripper.server.quartz.models.ScheduleEmailRequest;
import auxtripper.server.quartz.models.ScheduleEmailResponse;
import auxtripper.server.main.services.UserDataService;

@RestController
@RequestMapping(path = "/userData/api")
// @CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", allowCredentials = "true")
public class UserDataController {

    @Autowired
    UserDataService userDataService;

    @Autowired
    private AuthService aSrc;

    @GetMapping("/getCurrentUser")
    public ResponseEntity<String>  getCurrentUser() {
        return ResponseEntity.ok(Json.createObjectBuilder().add("username", aSrc.getCurrentUser()).build().toString());
    }

    @PostMapping(path = "/save")
    public ResponseEntity<String> saveUserData(@RequestBody UserData userData) {
        return ResponseEntity.ok("default");
    }

    @PostMapping(path = "/saveSpotifyUser")
    public ResponseEntity<String> saveUserData(@RequestBody SaveSpotifyUserRequest spotifyUser) {
        userDataService.ifUserHasSpotifyUser(spotifyUser.getUsername());
        SpotifyUser user = spotifyUser.getSpotifyUser();
        userDataService.saveSpotifyUser(user, spotifyUser.getRefreshToken(), spotifyUser.getUsername());

        return ResponseEntity.ok(Json.createObjectBuilder()
        .add("spotifyId", user.getId()).build().toString());
    }

    @GetMapping(path = "/spotifyUserExists")
    public ResponseEntity<String> spotifyUserExists(@RequestParam(name = "username") String username) {
        Optional<SpotifyUser> result = userDataService.getSpotifyUserByUsername(username);

        if(result.isPresent()) {
            return ResponseEntity.ok("true");
        }

        return ResponseEntity.ok("false");
    }

    @GetMapping(path = "/getSpotifyUser")
    public SpotifyUser getSpotifyUser(@RequestParam(name = "username") String username) {

        Optional<SpotifyUser> result = userDataService.getSpotifyUserByUsername(username);
        return result.get();
    }

    @PostMapping(path = "/updateRefreshToken")
    public Boolean updateRefreshToken(@RequestBody RefreshToken refreshToken) {
        return userDataService.updateRefreshToken(refreshToken.getRefreshToken(), refreshToken.getUsername());
    }

    @GetMapping(path = "/userEmail")
    public ResponseEntity<String> getEmailByUser(@RequestParam String username) {
        UserDataEmailRequest data = userDataService.getEmailAndNameByUsername(username);
        return ResponseEntity.ok(Json.createObjectBuilder().add("email", data.getEmail()).add("firstName", data.getFirstName()).build().toString());

    }

    @Autowired
    private Scheduler scheduler;
    private static final Logger logger = LoggerFactory.getLogger(EmailJobScheduleController.class);

    @PostMapping("/scheduleEmail")
    public ResponseEntity<ScheduleEmailResponse> scheduleEmail(@Valid @RequestBody ScheduleEmailRequest scheduleEmailRequest) {
        try {
            ZonedDateTime dateTime = ZonedDateTime.of(scheduleEmailRequest.getDateTime(), scheduleEmailRequest.getTimeZone());
            if(dateTime.isBefore(ZonedDateTime.now())) {
                ScheduleEmailResponse scheduleEmailResponse = new ScheduleEmailResponse(false,
                        "dateTime must be after current time");
                return ResponseEntity.badRequest().body(scheduleEmailResponse);
            }

            JobDetail jobDetail = buildJobDetail(scheduleEmailRequest);
            Trigger trigger = buildJobTrigger(jobDetail, dateTime);
            scheduler.scheduleJob(jobDetail, trigger);

            ScheduleEmailResponse scheduleEmailResponse = new ScheduleEmailResponse(true,
                    jobDetail.getKey().getName(), jobDetail.getKey().getGroup(), "Email Scheduled Successfully!");
            return ResponseEntity.ok(scheduleEmailResponse);
        } catch (SchedulerException ex) {
            logger.error("Error scheduling email", ex);

            ScheduleEmailResponse scheduleEmailResponse = new ScheduleEmailResponse(false,
                    "Error scheduling email. Please try later!");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(scheduleEmailResponse);
        }
    }

    private JobDetail buildJobDetail(ScheduleEmailRequest scheduleEmailRequest) {
        JobDataMap jobDataMap = new JobDataMap();

        jobDataMap.put("email", scheduleEmailRequest.getEmail());
        jobDataMap.put("subject", scheduleEmailRequest.getSubject());
        jobDataMap.put("body", scheduleEmailRequest.getBody());

        return JobBuilder.newJob(EmailJob.class)
                .withIdentity(UUID.randomUUID().toString(), "email-jobs")
                .withDescription("Send Email Job")
                .usingJobData(jobDataMap)
                .storeDurably()
                .build();
    }

    private Trigger buildJobTrigger(JobDetail jobDetail, ZonedDateTime startAt) {
        return TriggerBuilder.newTrigger()
                .forJob(jobDetail)
                .withIdentity(jobDetail.getKey().getName(), "email-triggers")
                .withDescription("Send Email Trigger")
                .startAt(Date.from(startAt.toInstant()))
                .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
                .build();
    }
    
}
