import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { loadingInterceptor } from './loading-interceptor';
import { LoadingService } from '../services/loading.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('loadingInterceptor', () => {
  let loadingService: LoadingService;
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => loadingInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LoadingService
    ]
    });
    loadingService = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should start and stop loading on successful request', (done) => {
    const req = new HttpRequest('GET', '/test');
    const mockNext = jasmine.createSpy('next').and.returnValue(of(new HttpResponse()));

    spyOn(loadingService, 'startLoading');
    spyOn(loadingService, 'stopLoading');

    interceptor(req, mockNext).subscribe({
      complete: () => {
        expect(loadingService.startLoading).toHaveBeenCalled();
        setTimeout(() => {
          expect(loadingService.stopLoading).toHaveBeenCalled();
          done();
        }, 0);
      }
    });
  });

  it('should start and stop loading on failed request', (done) => {
    const req = new HttpRequest('GET', '/test');
    const mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => new Error('Test error')));

    spyOn(loadingService, 'startLoading');
    spyOn(loadingService, 'stopLoading');

    interceptor(req, mockNext).subscribe({
      error: () => {
        expect(loadingService.startLoading).toHaveBeenCalled();
        setTimeout(() => {
          expect(loadingService.stopLoading).toHaveBeenCalled();
          done();
        }, 0);
      }
    });
  });
});
