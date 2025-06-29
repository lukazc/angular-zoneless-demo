import { TestBed } from '@angular/core/testing';
import { LocationStore } from './location.store';
import { Location, DEFAULT_LOCATION } from '../models/location.model';
import { provideZonelessChangeDetection } from '@angular/core';

describe('LocationStore', () => {
  let store: LocationStore;

  const testLocation: Location = {
    id: 99,
    name: 'Test Location',
    lat: 45.8144,
    lng: 15.9780
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LocationStore
      ]
    });

    store = TestBed.inject(LocationStore);
  });

  describe('Initial State', () => {
    it('should initialize with default location', () => {
      expect(store.selectedLocation()).toEqual(DEFAULT_LOCATION);
      expect(store.locations().length).toBeGreaterThan(0);
      expect(store.locationCount()).toBeGreaterThan(0);
    });

    it('should provide coordinates for default location', () => {
      const coords = store.selectedCoordinates();
      expect(coords.lat).toBe(DEFAULT_LOCATION.lat);
      expect(coords.lng).toBe(DEFAULT_LOCATION.lng);
    });
  });

  describe('Location Selection', () => {
    it('should select location by object', () => {
      store.selectLocation(testLocation);
      
      expect(store.selectedLocation()).toEqual(testLocation);
      expect(store.selectedCoordinates().lat).toBe(testLocation.lat);
      expect(store.selectedCoordinates().lng).toBe(testLocation.lng);
    });

    it('should select location by ID', () => {
      const firstLocation = store.locations()[0];
      
      store.selectLocationById(firstLocation.id);
      
      expect(store.selectedLocation()).toEqual(firstLocation);
    });

    it('should ignore invalid location ID', () => {
      const beforeSelection = store.selectedLocation();
      
      store.selectLocationById(99999); // Non-existent ID
      
      expect(store.selectedLocation()).toEqual(beforeSelection);
    });

    it('should reset to default location', () => {
      store.selectLocation(testLocation);
      expect(store.selectedLocation()).toEqual(testLocation);
      
      store.resetToDefault();
      
      expect(store.selectedLocation()).toEqual(DEFAULT_LOCATION);
    });
  });

  describe('Location Lookup', () => {
    it('should find location by ID', () => {
      const firstLocation = store.locations()[0];
      
      const found = store.getLocationById(firstLocation.id);
      
      expect(found).toEqual(firstLocation);
    });

    it('should return undefined for invalid ID', () => {
      const found = store.getLocationById(99999);
      
      expect(found).toBeUndefined();
    });
  });
});
