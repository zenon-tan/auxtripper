import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthStorageService } from 'src/app/services/auth-storage.service';

import { SpotifyAuthService } from 'src/app/services/spotify-auth.service';

@Component({
  selector: 'app-connect-spotify',
  templateUrl: './connect-spotify.component.html',
  styleUrls: ['./connect-spotify.component.css']
})
export class ConnectSpotifyComponent implements OnInit {

  request!: Request
  param$!: Subscription

  username = ''

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private spotifyAuthService: SpotifyAuthService,
    private authStorageService: AuthStorageService) {

  }

  ngOnInit(): void {

  }

  connectSpotify() {
    this.spotifyAuthService.getSpotifyUserLogin()
  }





}