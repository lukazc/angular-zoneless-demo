import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { signal } from '@angular/core';

import { LocationWidget } from './location-widget';
import { LocationStore } from '../../../../../core/stores/location.store';
import { Location, DEFAULT_LOCATION } from '../../../../../core/models/location.model';

describe('LocationWidget', () => {
    let component: LocationWidget;
    let fixture: ComponentFixture<LocationWidget>;
    let mockLocationStore: jasmine.SpyObj<LocationStore>;

    const mockLocations: Location[] = [
        { id: 1, name: 'Test Location 1', lat: 45.8044, lng: 16.0077, description: 'Test 1' },
        { id: 2, name: 'Test Location 2', lat: 45.8144, lng: 15.9794, description: 'Test 2' }
    ];

    beforeEach(async () => {
        mockLocationStore = jasmine.createSpyObj('LocationStore', [
            'selectLocation',
            'resetToDefault'
        ], {
            locations: signal(mockLocations).asReadonly(),
            selectedLocation: signal(DEFAULT_LOCATION).asReadonly(),
            locationCount: signal(mockLocations.length).asReadonly()
        });

        await TestBed.configureTestingModule({
            imports: [LocationWidget],
            providers: [
                provideZonelessChangeDetection(),
                { provide: LocationStore, useValue: mockLocationStore }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LocationWidget);
        component = fixture.componentInstance;
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should expose store signals correctly', () => {
            expect(component.locations()).toEqual(mockLocations);
            expect(component.selectedLocation()).toEqual(DEFAULT_LOCATION);
            expect(component.locationCount()).toBe(mockLocations.length);
        });
    });

    describe('Location Selection', () => {
        it('should call store selectLocation when location is selected', () => {
            const testLocation = mockLocations[0];
            
            component.onLocationSelect(testLocation);
            
            expect(mockLocationStore.selectLocation).toHaveBeenCalledWith(testLocation);
        });

        it('should call store resetToDefault when reset is triggered', () => {
            component.onResetToDefault();
            
            expect(mockLocationStore.resetToDefault).toHaveBeenCalled();
        });
    });

    describe('Selection State', () => {
        it('should correctly identify selected location', () => {
            const isSelectedFn = component.isLocationSelected();
            
            expect(isSelectedFn(DEFAULT_LOCATION)).toBe(true);
            expect(isSelectedFn(mockLocations[1])).toBe(false);
        });
    });
});
