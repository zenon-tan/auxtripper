import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataConstants } from 'src/app/constants/google-route.constant';
import { FormatTimeService } from 'src/app/services/format-time.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  animations: [
    trigger('fadeTitle', [
      transition(':enter', [
        style({opacity: 0}),
        animate('1s 500ms ease-out'), style({opacity: 1})
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('1s 500ms ease-out'), style({opacity: 1})
      ])
    ]),
    trigger('fadeSubtitle', [
      transition(':enter', [
        style({opacity: 0}),
        animate('1s 1200ms ease-out'), style({opacity: 1})
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('1s 1200ms ease-out'), style({opacity: 0})
      ])
    ]),
    trigger('fadeInstr', [
      transition(':enter', [
        style({opacity: 0}),
        animate('1s 2200ms ease-out'), style({opacity: 1})
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('1s 2200ms ease-out'), style({opacity: 0})
      ])
    ]),
    trigger('fadeBar', [
      transition(':enter', [
        style({opacity: 0}),
        animate('1s 3500ms ease-out'), style({opacity: 1})
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('1s 3500ms ease-out'), style({opacity: 0})
      ])
    ])
  ]
})
export class LandingComponent implements OnInit {

  videoIds: string[] = ['https://player.vimeo.com/video/516313351?h=813b68592e&playsinline=0&color=ebff00&title=0&byline=0&portrait=0&autoplay=1&background=1',
  'https://player.vimeo.com/video/440055496?h=813b68592e&playsinline=0&color=ebff00&title=0&byline=0&portrait=0&autoplay=1&background=1',
  'https://player.vimeo.com/video/210752120?h=813b68592e&playsinline=0&color=ebff00&title=0&byline=0&portrait=0&autoplay=1&background=1',
  'https://player.vimeo.com/video/436736842?h=813b68592e&playsinline=0&color=ebff00&title=0&byline=0&portrait=0&autoplay=1&background=1'
]

  next = false

  travelModes: any[] = DataConstants.travelModes
  hour: string[] = DataConstants.hour
  minute: string[] = DataConstants.minute

  form!: FormGroup
  origin: any
  destination: any
  origin_latlng!: google.maps.LatLngLiteral
  destination_latlng!: google.maps.LatLngLiteral
  travelMode = 'driving'

  photoUrls: string[] = []
  videoIdx = 0

  // You can only select a trip an hour after current time
  today = new Date(new Date().getTime() + (60 * 60 * 1000))

  constructor(
    private fb: FormBuilder, private router: Router,
    private formatTimeService: FormatTimeService,
    private sessionStorageService: SessionStorageService) { }

  ngOnInit(): void {

    this.videoIdx = Math.floor(Math.random() * this.videoIds.length)

    this.sessionStorageService.clearForLoginUser()

    this.form = this.fb.group({
      origin: this.fb.control<string>('', [Validators.required]),
      destination: this.fb.control<string>('', [Validators.required]),
      travelMode: this.fb.control<string>('driving', [Validators.required]),
      date: this.fb.control<Date>(this.today)
    })
  }

  processForm() {
    this.router.navigate(['/trip'], {
      queryParams: {
        origin: this.origin,
        destination: this.destination,
        origin_lat: this.origin_latlng.lat,
        origin_lng: this.origin_latlng.lng,
        destination_lat: this.destination_latlng.lat,
        destination_lng: this.destination_latlng.lng,
        travelMode: this.form.value['travelMode'],
        when: 'depart',
        time: this.formatTimeService.formatToDateTimePicker(this.form.value['date'])
      }
    })
  }

  getOrigin(event: any) {
    this.origin = event.formatted_address
    this.origin_latlng = event.geometry.location.toJSON()
    console.info(this.origin_latlng)
  }

  getDest(event: any) {
    this.destination = event.formatted_address
    this.destination_latlng = event.geometry.location.toJSON()
  }

  getTravelMode(mode: string) {
    this.form.controls['travelMode'].setValue(mode)
  }

}
