import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataChartWidget } from '../widgets/data-chart-widget/data-chart-widget';
import { DataTableWidget } from '../widgets/data-table-widget/data-table-widget';
import { LocationWidget } from '../widgets/location-widget/location-widget/location-widget';
import { MapWidget } from '../widgets/map-widget/map-widget/map-widget';
import { Dashboard } from './dashboard';

@Component({
  selector: 'app-map-widget',
  template: '<div>Mock Map Widget</div>'
})
class MockMapWidget { }

@Component({
  selector: 'app-location-widget',
  template: '<div>Mock Location Widget</div>'
})
class MockLocationWidget { }

@Component({
  selector: 'app-data-chart-widget',
  template: '<div>Mock Chart Widget</div>'
})
class MockDataChartWidget { }

@Component({
  selector: 'app-data-table-widget',
  template: '<div>Mock Table Widget</div>'
})
class MockDataTableWidget { }

describe('Dashboard', () => {
    let component: Dashboard;
    let fixture: ComponentFixture<Dashboard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Dashboard],
            providers: [
                provideZonelessChangeDetection()
            ]
        })
        .overrideComponent(Dashboard, {
            remove: { 
                imports: [
                    // Remove actual widget imports to avoid dependency issues
                    MapWidget,
                    LocationWidget,
                    DataChartWidget,
                    DataTableWidget
                ]
            },
            add: {
                imports: [
                    MockMapWidget,
                    MockLocationWidget,
                    MockDataChartWidget,
                    MockDataTableWidget
                ]
            }
        })
        .compileComponents();

        fixture = TestBed.createComponent(Dashboard);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
