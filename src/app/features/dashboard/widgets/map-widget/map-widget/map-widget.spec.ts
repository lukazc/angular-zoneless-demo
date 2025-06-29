import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { signal } from '@angular/core';

import { MapWidget } from './map-widget';
import { LocationStore } from '../../../../../core/stores/location.store';
import { DEFAULT_LOCATION } from '../../../../../core/models/location.model';

describe('MapWidget', () => {
    let component: MapWidget;
    let fixture: ComponentFixture<MapWidget>;
    let mockLocationStore: jasmine.SpyObj<LocationStore>;

    beforeEach(async () => {
        mockLocationStore = jasmine.createSpyObj('LocationStore', [], {
            selectedLocation: signal(DEFAULT_LOCATION).asReadonly()
        });

        await TestBed.configureTestingModule({
            imports: [MapWidget],
            providers: [
                provideZonelessChangeDetection(),
                { provide: LocationStore, useValue: mockLocationStore }
            ]
        }).compileComponents();
    });

    describe('Component Lifecycle', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(MapWidget);
            component = fixture.componentInstance;
            
            // Prevent all lifecycle and map initialization
            spyOn(component as any, 'initializeMap').and.stub();
            spyOn(component, 'ngAfterViewInit').and.stub();
            
            // Mock ViewChild
            (component as any).mapContainer = {
                nativeElement: document.createElement('div')
            };
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should expose selected location from store', () => {
            expect(component.selectedLocation()).toEqual(DEFAULT_LOCATION);
        });

        it('should cleanup map on destroy', () => {
            const mockMap = jasmine.createSpyObj('Map', ['remove']);
            (component as any).map = mockMap;
            
            component.ngOnDestroy();
            
            expect(mockMap.remove).toHaveBeenCalled();
        });

        it('should handle destroy when no map exists', () => {
            (component as any).map = undefined;
            expect(() => component.ngOnDestroy()).not.toThrow();
        });
    });

    describe('Public Methods', () => {
        it('should center on current location', () => {
            // Create component but don't trigger Angular lifecycle
            const fixture = TestBed.createComponent(MapWidget);
            const component = fixture.componentInstance;
            
            // Mock everything before any initialization
            spyOn(component as any, 'initializeMap').and.stub();
            spyOn(component, 'ngAfterViewInit').and.stub();
            
            // Mock the ViewChild and map
            (component as any).mapContainer = {
                nativeElement: document.createElement('div')
            };
            
            const mockMap = jasmine.createSpyObj('Map', ['invalidateSize', 'flyTo']);
            (component as any).map = mockMap;
            
            // Test the method
            component.centerOnCurrentLocation();
            
            expect(mockMap.invalidateSize).toHaveBeenCalled();
            expect(mockMap.flyTo).toHaveBeenCalledWith(
                [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng], 
                15
            );
            
            // Manual cleanup to prevent test bed issues
            (component as any).map = undefined;
            fixture.destroy();
        });

        it('should handle center when no map exists', () => {
            const fixture = TestBed.createComponent(MapWidget);
            const component = fixture.componentInstance;
            
            spyOn(component as any, 'initializeMap').and.stub();
            spyOn(component, 'ngAfterViewInit').and.stub();
            
            (component as any).mapContainer = {
                nativeElement: document.createElement('div')
            };
            (component as any).map = undefined;
            
            expect(() => component.centerOnCurrentLocation()).not.toThrow();
            
            fixture.destroy();
        });
    });
});
