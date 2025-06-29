import { TestBed } from '@angular/core/testing';
import { DataStore } from './data.store';
import { DataApi } from '../services/data-api/data-api.service';
import { of, throwError } from 'rxjs';
import { RawDataResponse } from '../models/data.model';
import { provideZonelessChangeDetection } from '@angular/core';

describe('DataStore', () => {
  let store: DataStore;
  let mockDataApi: jasmine.SpyObj<DataApi>;

  const mockRawData: RawDataResponse = {
    '2024-01-01T10:00:00.000Z': [
      {
        timestampStart: '2024-01-01T10:00:00.000Z',
        timestampEnd: '2024-01-01T10:15:00.000Z',
        value: 90
      },
      {
        timestampStart: '2024-01-01T10:15:00.000Z',
        timestampEnd: '2024-01-01T10:30:00.000Z',
        value: 110
      }
    ]
  };

  beforeEach(() => {
    const dataApiSpy = jasmine.createSpyObj('DataApi', ['loadRawData']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        DataStore,
        { provide: DataApi, useValue: dataApiSpy }
      ]
    });

    store = TestBed.inject(DataStore);
    mockDataApi = TestBed.inject(DataApi) as jasmine.SpyObj<DataApi>;
  });

  describe('Initial State', () => {
    it('should initialize with empty state', () => {
      expect(store.isLoading()).toBe(false);
      expect(store.hasError()).toBe(false);
      expect(store.hasData()).toBe(false);
      expect(store.dataCount()).toBe(0);
    });
  });

  describe('Data Loading', () => {
    it('should load and process data successfully', (done) => {
      mockDataApi.loadRawData.and.returnValue(of(mockRawData));

      store.loadData();

      setTimeout(() => {
        expect(store.isLoading()).toBe(false);
        expect(store.hasData()).toBe(true);
        expect(store.dataCount()).toBe(1);
        
        // Verify processed data
        const hourlyData = store.hourlyData();
        expect(hourlyData[0].averageValue).toBe(100); // (90+110)/2
        expect(hourlyData[0].minValue).toBe(90);
        expect(hourlyData[0].maxValue).toBe(110);

        // Verify chart data exists
        const chartData = store.chartData();
        expect(chartData.labels.length).toBe(1);
        expect(chartData.datasets.length).toBe(3);
        
        done();
      }, 0);
    });

    it('should handle API errors', (done) => {
      mockDataApi.loadRawData.and.returnValue(throwError(() => new Error('API Error')));

      store.loadData();

      setTimeout(() => {
        expect(store.isLoading()).toBe(false);
        expect(store.hasError()).toBe(true);
        expect(store.error()).toBe('Failed to load data');
        done();
      }, 0);
    });
  });

  describe('Data Management', () => {
    it('should clear data', () => {
      mockDataApi.loadRawData.and.returnValue(of(mockRawData));

      store.loadData();
      store.clear();

      expect(store.hasData()).toBe(false);
      expect(store.isLoading()).toBe(false);
      expect(store.hasError()).toBe(false);
    });
  });
});
