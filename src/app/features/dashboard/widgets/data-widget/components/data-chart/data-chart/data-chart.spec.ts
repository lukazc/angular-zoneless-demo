import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataChart } from './data-chart';
import { provideZonelessChangeDetection } from '@angular/core';

describe('DataChart', () => {
    let component: DataChart;
    let fixture: ComponentFixture<DataChart>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DataChart],
            providers: [
                provideZonelessChangeDetection()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DataChart);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
