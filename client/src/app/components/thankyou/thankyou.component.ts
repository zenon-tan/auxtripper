import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SpotifyUser } from 'src/app/models/spotify-models';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {

  playlistUrl = ''
  playlistUri = ''
  playlistId = ''
  playlistEmbedUrl = ''
  param$!: Subscription
  spotifyUser!: SpotifyUser

  constructor(private router: Router, 
    private activatedRoute: ActivatedRoute,
    private sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {

    if (
      JSON.parse(sessionStorage.getItem('spotifyUser')!) != null) {
      this.spotifyUser = JSON.parse(sessionStorage.getItem('spotifyUser')!)
    } else {
      this.router.navigate(['/'])
    }

    const param = this.activatedRoute.snapshot.paramMap.get('id')
    if(param) {
      this.playlistId = param
      this.playlistEmbedUrl = 'https://open.spotify.com/embed/playlist/'+ this.playlistId + '?utm_source=generator&theme=0'
        this.playlistUrl = 'https://open.spotify.com/playlist/' + this.playlistId
        this.playlistUri = 'spotify:playlist:' + this.playlistId
    }

    this.sessionStorageService.clearForNonUser()
  }

  goToPlaylist() {
    window.location.href = this.playlistUri;
    window.open(this.playlistUrl, "_blank");
  }

  goToLogin() {
    this.router.navigate(['/signup'])
  }

}
