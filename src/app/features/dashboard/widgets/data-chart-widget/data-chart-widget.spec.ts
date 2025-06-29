import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataChartWidget } from './data-chart-widget';
import { provideZonelessChangeDetection } from '@angular/core';

describe('DataChartWidget', () => {
    let component: DataChartWidget;
    let fixture: ComponentFixture<DataChartWidget>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DataChartWidget],
            providers: [
                provideZonelessChangeDetection()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DataChartWidget);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
