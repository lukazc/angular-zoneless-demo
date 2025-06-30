import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataChartWidget } from './data-chart-widget';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('DataChartWidget', () => {
    let component: DataChartWidget;
    let fixture: ComponentFixture<DataChartWidget>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DataChartWidget],
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                provideHttpClientTesting()
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

    it('should initialize with bar chart type', () => {
        expect(component.chartType()).toBe('bar');
    });

    it('should change chart type when changeChartType is called', () => {
        component.changeChartType('line');
        expect(component.chartType()).toBe('line');

        component.changeChartType('bar');
        expect(component.chartType()).toBe('bar');
    });

    it('should expose store signals', () => {
        expect(component.isLoading).toBeDefined();
        expect(component.hasError).toBeDefined();
        expect(component.error).toBeDefined();
        expect(component.hasData).toBeDefined();
        expect(component.chartData).toBeDefined();
    });

    it('should initialize with only the average dataset visible', () => {
        const visibility = component.datasetVisibility();
        expect(visibility.average).toBe(true);
        expect(visibility.peak).toBe(false);
        expect(visibility.minimum).toBe(false);
    });
});
