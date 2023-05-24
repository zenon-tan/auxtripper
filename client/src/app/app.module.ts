import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NewTripComponent } from './components/new-trip/new-trip.component';
import { DirectionsService } from './services/directions.service';
import { GoogleGeocodingService } from './services/google-geocoding.service';
import { GoogleRequestService } from './services/google-request.service';
import { GoogleRouteService } from './services/google-route.service';
import { LocationService } from './services/location.service';
import { AppMaterialModule } from './app-material/app-material.module';
import { ConnectSpotifyComponent } from './components/connect-spotify/connect-spotify.component';
import { NewPlaylistComponent } from './components/new-playlist/new-playlist.component';
import { PlaylistSummaryComponent } from './components/playlist-summary/playlist-summary.component';
import { CreatePlaylistComponent } from './components/create-playlist/create-playlist.component';
import { TripsComponent } from './components/trips/trips.component';
import { LoginMatComponent } from './components/login-mat/login-mat.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { SpotifyAuthService } from './services/spotify-auth.service';
import { AuthSuccessComponent } from './components/auth-success/auth-success.component';
import { SpotifyGetUserService } from './services/spotify-api.service';
import { SafePipeService } from './services/safe-pipe.service';
import { ChartDisplayService } from './services/chart-display.service';
import { MapDialogComponent } from './components/map-dialog/map-dialog.component';
import { SaveDataService } from './services/save-data.service';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { MatUserSaveComponent } from './components/mat-user-save/mat-user-save.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { SpotifyObjectService } from './services/spotify-object.service';
import { AuthService } from './services/auth.service';
import { AuthStorageService } from './services/auth-storage.service';
import { httpInterceptorProvider } from './_helpers/auth.interceptor';
import { SessionStorageService } from './services/session-storage.service';
import { LoginComponent } from './components/login/login.component';
import { DisplayDurationPipeService } from './services/display-duration-pipe.service';
import { PkceCodeService } from './services/pkce-code.service';
import { RegisterComponent } from './components/register/register.component';
import { ServiceWorkerModule } from '@angular/service-worker';




@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NewTripComponent,
    ConnectSpotifyComponent,
    NewPlaylistComponent,
    PlaylistSummaryComponent,
    CreatePlaylistComponent,
    TripsComponent,
    LoginMatComponent,
    ThankyouComponent,
    AuthSuccessComponent,
    SafePipeService,
    DisplayDurationPipeService,
    MapDialogComponent,
    PlaylistComponent,
    MatUserSaveComponent,
    UserDashboardComponent,
    LoginComponent,
    RegisterComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GoogleMapsModule,
    GooglePlaceModule,
    AppMaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [LocationService, DirectionsService,
    httpInterceptorProvider,
    GoogleRouteService, GoogleRequestService,
    GoogleGeocodingService, GoogleMap, SpotifyAuthService,
    SpotifyGetUserService, SpotifyObjectService, ChartDisplayService,
    SaveDataService, AuthService, AuthStorageService, SessionStorageService, PkceCodeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
