export class DataConstants {

    public static TIME_ZONE_API = 'https://maps.googleapis.com/maps/api/timezone/json'

    public static options: any = {
        componentRestrictions: {
          country: []
        },
        scaleControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        mapTypeControl: false,
        mapId: '7909ac7dfbf73503'
      }

    public static hour: string[] = [
        '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
    ]

    public static minute: string[] = [
        '00', '15', '30', '45'
    ]

    public static transitOptionsSelect: any[] = [
        { name: 'Bus', value: google.maps.TransitMode.BUS },
        { name: 'Rail', value: google.maps.TransitMode.RAIL },
        { name: 'Subway', value: google.maps.TransitMode.SUBWAY },
        { name: 'Train', value: google.maps.TransitMode.TRAIN },
        { name: 'Tram', value: google.maps.TransitMode.TRAM }
    ]

    public static transitOptions: google.maps.TransitMode[] =
        [google.maps.TransitMode.BUS,
        google.maps.TransitMode.RAIL,
        google.maps.TransitMode.SUBWAY,
        google.maps.TransitMode.TRAIN,
        google.maps.TransitMode.TRAM]

    public static travelModes: any[] = [
        { name: 'DRIVING', value: google.maps.TravelMode.DRIVING, icon: 'directions_car' },
        { name: 'TRANSIT', value: google.maps.TravelMode.TRANSIT, icon: 'directions_transit' },
        { name: 'WALKING', value: google.maps.TravelMode.WALKING, icon: 'directions_walk' },
        { name: 'BICYCLING', value: google.maps.TravelMode.BICYCLING, icon: 'directions_bike' },

    ]

    public static directionsRenderOption = {
        window: true,
        draggable: false,
        routeIndex: 0,
        panel: document.getElementById('panel') as HTMLElement,
        hideRouteList: false,
        markerOptions: {
            draggable: true,
            clickable: true,
        },
        polylineOptions: {
            clickable: true,
            strokeColor: '#1DB954',
            strokeOpacity: 0,
            strokeWeight: 1,
            icons: [{
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillOpacity: 1,
                    scale: 3
                },
                offset: '0',
                repeat: '1px'
            }],
        }
    }


}