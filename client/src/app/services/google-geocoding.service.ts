import { Injectable } from '@angular/core';
import { MapGeocoder } from '@angular/google-maps';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleGeocodingService {

  constructor(private geocoder: MapGeocoder) { }

  getAddressFromLatLng(latlng: google.maps.LatLng) {

    return this.geocoder.geocode({location: latlng})
  }
}
