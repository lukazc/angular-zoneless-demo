import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataWidget } from './data-widget';
import { provideZonelessChangeDetection } from '@angular/core';

describe('DataWidget', () => {
    let component: DataWidget;
    let fixture: ComponentFixture<DataWidget>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DataWidget],
            providers: [
                provideZonelessChangeDetection()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DataWidget);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
