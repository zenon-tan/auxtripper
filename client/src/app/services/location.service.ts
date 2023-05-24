import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DataConstants } from '../constants/google-route.constant';
import { Environment } from '../env/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  coords!: google.maps.LatLngLiteral

  constructor(private http: HttpClient) { }

  getLocation(event: google.maps.MapMouseEvent) {
    if(event.latLng != null) {
      return event.latLng.toJSON()
    }
    return null
  }

  async getCurrentLocation(): Promise<google.maps.LatLngLiteral> {

      navigator.geolocation.getCurrentPosition(resp => {
        console.info(resp.coords)
        this.coords = {lat: resp.coords.latitude, lng: resp.coords.longitude}
    
      })

      return this.coords

  }

  calculateTimeZone(origin: any, time: Date) {

    const params = new HttpParams()
    .append('location', origin.lat + ',' + origin.lng)
    .append('timestamp' ,time.getTime() / 1000)
    .append('key', Environment.GOOGLE_MAP_KEY)

    return firstValueFrom(this.http.get(DataConstants.TIME_ZONE_API, { params }))

  }

}
