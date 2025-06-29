import { AfterViewInit, Component, effect, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import * as L from 'leaflet';
import { LocationStore } from '../../../../../core/stores/location.store';

/**
 * Map Widget Component
 * 
 * Displays an interactive Leaflet map that reactively updates based on location store
 * Uses signals and effects for zoneless Angular reactivity
 */
@Component({
    selector: 'app-map-widget',
    imports: [
        MatCardModule,
        MatIcon,
        MatButton
    ],
    templateUrl: './map-widget.html',
    styleUrl: './map-widget.scss',
})
export class MapWidget implements AfterViewInit, OnDestroy {
    /** Reference to the map container element */
    @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

    /** Injected location store for reactive state */
    private readonly locationStore = inject(LocationStore);

    /** Leaflet map instance */
    private map?: L.Map;

    /** Current location marker */
    private marker?: L.Marker;

    /** Currently selected location */
    readonly selectedLocation = this.locationStore.selectedLocation;

    constructor() {
        effect(() => {
            const location = this.selectedLocation();
            if (this.map && location) {
                this.updateMapLocation(location.lat, location.lng, location.name);
            }
        });
    }

    ngAfterViewInit(): void {
        this.initializeMap();
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
    }

    /**
     * Initializes the Leaflet map with default settings
     */
    private initializeMap(): void {
        this.fixLeafletIcons();

        const location = this.selectedLocation();
        this.map = L.map(this.mapContainer.nativeElement).setView([location.lat, location.lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.updateMapLocation(location.lat, location.lng, location.name);
    }

    /**
     * Fixes Leaflet default icon issue in webpack environments
     */
    private fixLeafletIcons(): void {
        const iconRetinaUrl = 'assets/marker-icon-2x.png';
        const iconUrl = 'assets/marker-icon.png';
        const shadowUrl = 'assets/marker-shadow.png';

        const iconDefault = L.icon({
            iconRetinaUrl,
            iconUrl,
            shadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });

        L.Marker.prototype.options.icon = iconDefault;
    }

    /**
     * Adds a marker to the map
     */
    private addMarker(lat: number, lng: number, title: string): void {
        if (!this.map) return;

        if (this.marker) {
            this.map.removeLayer(this.marker);
        }

        this.marker = L.marker([lat, lng])
            .addTo(this.map);
    }

    /**
     * Updates map location and marker
     */
    private updateMapLocation(lat: number, lng: number, title: string): void {
        if (!this.map) return;

        this.map.flyTo([lat, lng], 15, {
            animate: true,
            duration: 1
        });

        this.addMarker(lat, lng, title);
    }

    /**
     * Centers the map on the current selected location
     */
    centerOnCurrentLocation(): void {
        const location = this.selectedLocation();
        if (this.map && location) {
            this.map.invalidateSize();
            this.map.flyTo([location.lat, location.lng], 15);
        }
    }
}
