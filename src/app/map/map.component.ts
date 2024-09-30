import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})

export class MapComponent implements OnInit {

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  
  map: google.maps.Map | undefined;

  ngOnInit() {

    this.loadGoogleMapsApi().then(() => {
      this.initMap();
    });

  }

  loadGoogleMapsApi(): Promise<void> {

    return new Promise((resolve, reject) => {

      if (window['google'] && window['google'].maps) {

        resolve();
        return;

      }

      const script = document.createElement('script');

      script.src = `...`;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);

    });

  }

  async initMap(): Promise<void> {

      const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

      this.map = new Map(this.mapContainer.nativeElement, {
        center: { lat: 41.77420, lng: -1.21830 },
        zoom: 15
      });

  }

}