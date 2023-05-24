import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { NewTripComponent } from './components/new-trip/new-trip.component';
import { ConnectSpotifyComponent } from './components/connect-spotify/connect-spotify.component';
import { NewPlaylistComponent } from './components/new-playlist/new-playlist.component';
import { PlaylistSummaryComponent } from './components/playlist-summary/playlist-summary.component';
import { CreatePlaylistComponent } from './components/create-playlist/create-playlist.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { LoginComponent } from './components/login/login.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AuthSuccessComponent } from './components/auth-success/auth-success.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'auth-success', component: AuthSuccessComponent },
  { path: 'trip', component: NewTripComponent, title: 'AuxTripper | New Trip' },
  { path: 'connect-spotify', component: ConnectSpotifyComponent, title: 'AuxTripper | Connect to Spotify' },
  { path: 'login', component: LoginComponent, title: 'AuxTripper | Login' },
  {path: 'signup', component: RegisterComponent, title: 'AuxTripper | Signup' },

  {
    path: 'playlist', component: PlaylistComponent,
    children: [
      { path: 'new', component: NewPlaylistComponent, title: 'AuxTripper | New Playlist' },
      { path: 'summary', component: PlaylistSummaryComponent, title: 'AuxTripper | Playlist Summary' },
      { path: 'save', component: CreatePlaylistComponent, title: 'AuxTripper | Create Playlist' },
      { path: ':id', component: ThankyouComponent, title: 'AuxTripper | Thank You!' }
    ]
  },
  { path: 'dashboard', component: UserDashboardComponent, title: 'AuxTripper | Dashboard' },
  // {path}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
