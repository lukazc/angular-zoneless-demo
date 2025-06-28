import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapWidget } from './map-widget';
import { provideZonelessChangeDetection } from '@angular/core';

describe('MapWidget', () => {
    let component: MapWidget;
    let fixture: ComponentFixture<MapWidget>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapWidget],
            providers: [
                provideZonelessChangeDetection()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapWidget);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
