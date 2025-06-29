import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { DataApi } from './data-api.service';
import { RawDataResponse } from '../../models/data.model';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DataApi', () => {
  let service: DataApi;
  let httpMock: HttpTestingController;

  const mockRawData: RawDataResponse = {
    '2024-01-01T10:00:00.000Z': [
      {
        timestampStart: '2024-01-01T10:00:00.000Z',
        timestampEnd: '2024-01-01T10:15:00.000Z',
        value: 100
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    
    service = TestBed.inject(DataApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load raw data successfully', () => {
    service.loadRawData().subscribe(data => {
      expect(data).toEqual(mockRawData);
    });

    const req = httpMock.expectOne('/podaci.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockRawData);
  });

  it('should handle HTTP errors and return empty object', () => {
    service.loadRawData().subscribe(data => {
      expect(data).toEqual({});
    });

    const req = httpMock.expectOne('/podaci.json');
    req.error(new ProgressEvent('Network error'));
  });

  it('should handle malformed JSON and return empty object', () => {
    service.loadRawData().subscribe(data => {
      expect(data).toEqual({});
    });

    const req = httpMock.expectOne('/podaci.json');
    req.error(new ProgressEvent('Parse error'));
  });
});
