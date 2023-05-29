import { Injectable } from '@angular/core';
import { MapGeocoder } from '@angular/google-maps';

@Injectable({
  providedIn: 'root'
})
export class GoogleGeocodingService {

  constructor(private geocoder: MapGeocoder) { }

  getAddressFromLatLng(latlng: google.maps.LatLng) {

    return this.geocoder.geocode({location: latlng})
  }
}
