import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableWidget } from './data-table-widget';
import { DataStore } from '../../../../core/stores/data.store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { NoopAnimationsModule, provideNoopAnimations } from '@angular/platform-browser/animations';

// Mock DataStore
const mockDataStore = {
  isLoading: signal(false),
  hasError: signal(false),
  error: signal<string | null>(null),
  hasData: signal(true),
  hourlyData: signal([
    {
      timestamp: '2023-01-01T00:00:00Z',
      hour: '00:00',
      averageValue: 25.5,
      dataPointsCount: 4,
      minValue: 20.1,
      maxValue: 30.2
    },
    {
      timestamp: '2023-01-01T01:00:00Z',
      hour: '01:00',
      averageValue: 28.3,
      dataPointsCount: 4,
      minValue: 22.5,
      maxValue: 35.1
    }
  ]),
  loadData: jasmine.createSpy('loadData'),
  reload: jasmine.createSpy('reload')
};

describe('DataTableWidget', () => {
    let component: DataTableWidget;
    let fixture: ComponentFixture<DataTableWidget>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, DataTableWidget],
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                provideHttpClientTesting(),
                provideNoopAnimations(),
                { provide: DataStore, useValue: mockDataStore }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DataTableWidget);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display loading state', async () => {
        mockDataStore.isLoading.set(true);
        await fixture.whenStable();

        const loadingElement = fixture.nativeElement.querySelector('.loading-state');
        expect(loadingElement).toBeTruthy();
        expect(loadingElement.textContent).toContain('Loading hourly data...');
        
        const spinner = fixture.nativeElement.querySelector('mat-spinner');
        expect(spinner).toBeTruthy();
    });

    it('should display error state with retry button', async () => {
        mockDataStore.isLoading.set(false);
        mockDataStore.hasError.set(true);
        mockDataStore.error.set('Failed to load data');
        await fixture.whenStable();

        const errorElement = fixture.nativeElement.querySelector('.error-state');
        expect(errorElement).toBeTruthy();
        expect(errorElement.textContent).toContain('Failed to load data');

        const retryButton = fixture.nativeElement.querySelector('button[aria-label="Retry loading data"]');
        expect(retryButton).toBeTruthy();
    });

    it('should call retry when retry button is clicked', async () => {
        mockDataStore.isLoading.set(false);
        mockDataStore.hasError.set(true);
        await fixture.whenStable();

        const retryButton = fixture.nativeElement.querySelector('button[aria-label="Retry loading data"]');
        retryButton.click();

        expect(mockDataStore.reload).toHaveBeenCalled();
    });

    it('should display Material table when data is available', async () => {
        mockDataStore.isLoading.set(false);
        mockDataStore.hasError.set(false);
        mockDataStore.hasData.set(true);
        await fixture.whenStable();

        const tableContainer = fixture.nativeElement.querySelector('.table-container');
        expect(tableContainer).toBeTruthy();

        const matTable = fixture.nativeElement.querySelector('table[mat-table]');
        expect(matTable).toBeTruthy();

        // Check if header cells are present
        const headerCells = fixture.nativeElement.querySelectorAll('.mat-mdc-header-cell');
        expect(headerCells.length).toBe(4); // Time, Average, Peak, Minimum
    });

    it('should display empty state when no data', async() => {
        mockDataStore.isLoading.set(false);
        mockDataStore.hasError.set(false);
        mockDataStore.hasData.set(false);
        await fixture.whenStable();

        const emptyElement = fixture.nativeElement.querySelector('.empty-state');
        expect(emptyElement).toBeTruthy();
        expect(emptyElement.textContent).toContain('No data available');
    });

    it('should call dataStore.loadData on init', () => {
        component.ngOnInit();
        expect(mockDataStore.loadData).toHaveBeenCalled();
    });

    it('should have correct displayed columns', () => {
        expect(component.displayedColumns).toEqual(['time', 'average', 'peak', 'minimum']);
    });
});
