import { Component, computed, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Location } from '../../../../../core/models/location.model';
import { LocationStore } from '../../../../../core/stores/location.store';

/**
 * Location Widget Component
 * 
 * Displays a list of 10 locations that can be selected to update the map
 * Uses signals for reactive state management
 */
@Component({
  selector: 'app-location-widget',
  imports: [
    MatListModule,
    MatCardModule,
    MatIcon,
    MatButton
  ],
  templateUrl: './location-widget.html',
  styleUrl: './location-widget.scss'
})
export class LocationWidget {
  /** Injected location store for state management */
  private readonly locationStore = inject(LocationStore);

  /** All available locations from the store */
  readonly locations = this.locationStore.locations;
  
  /** Currently selected location */
  readonly selectedLocation = this.locationStore.selectedLocation;
  
  /** Computed signal for location count */
  readonly locationCount = this.locationStore.locationCount;

  /** Computed signal to check if a location is selected */
  readonly isLocationSelected = computed(() => {
    return (location: Location) => {
      return this.selectedLocation().id === location.id;
    };
  });

  /**
   * Handles location selection
   * @param location The location to select
   */
  onLocationSelect(location: Location): void {
    this.locationStore.selectLocation(location);
  }

  /**
   * Resets to the default location
   */
  onResetToDefault(): void {
    this.locationStore.resetToDefault();
  }
}
