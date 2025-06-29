import { Injectable, computed, signal } from "@angular/core";
import { Location, DEFAULT_LOCATION, ZAGREB_LOCATIONS } from "../models/location.model";

/**
 * Centralized store for location state management
 * Uses signals for reactive state management in zoneless Angular
 */
@Injectable({ providedIn: 'root' })
export class LocationStore {
    /** Private writable signal for selected location */
    private readonly _selectedLocation = signal<Location>(DEFAULT_LOCATION);
    
    /** Private writable signal for all available locations */
    private readonly _locations = signal<Location[]>(ZAGREB_LOCATIONS);

    /** Public readonly signal for selected location */
    readonly selectedLocation = this._selectedLocation.asReadonly();
    
    /** Public readonly signal for all locations */
    readonly locations = this._locations.asReadonly();
    
    /** Computed signal for selected location coordinates */
    readonly selectedCoordinates = computed(() => {
        const location = this._selectedLocation();
        return {
            lat: location.lat,
            lng: location.lng
        };
    });

    /** Computed signal for location count */
    readonly locationCount = computed(() => this._locations().length);

    /**
     * Updates the selected location
     * @param location The location to select
     */
    selectLocation(location: Location): void {
        this._selectedLocation.set(location);
    }

    /**
     * Selects a location by its ID
     * @param id The location ID
     */
    selectLocationById(id: number): void {
        const location = this._locations().find(loc => loc.id === id);
        if (location) {
            this._selectedLocation.set(location);
        }
    }

    /**
     * Gets a location by ID
     * @param id The location ID
     * @returns The location or undefined if not found
     */
    getLocationById(id: number): Location | undefined {
        return this._locations().find(loc => loc.id === id);
    }

    /**
     * Resets to default location
     */
    resetToDefault(): void {
        this._selectedLocation.set(DEFAULT_LOCATION);
    }
}