import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableWidget } from './data-table-widget';
import { provideZonelessChangeDetection } from '@angular/core';

describe('DataTableWidget', () => {
    let component: DataTableWidget;
    let fixture: ComponentFixture<DataTableWidget>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DataTableWidget],
            providers: [
                provideZonelessChangeDetection()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DataTableWidget);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
