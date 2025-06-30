import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            provideZonelessChangeDetection(),
        ]
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with loading false', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('should set loading to true when startLoading is called', () => {
    service.startLoading();
    expect(service.isLoading()).toBe(true);
  });

  it('should set loading to false when stopLoading is called', () => {
    service.startLoading();
    service.stopLoading();
    expect(service.isLoading()).toBe(false);
  });

  it('should handle multiple concurrent requests', () => {
    service.startLoading();
    service.startLoading();
    expect(service.isLoading()).toBe(true);

    service.stopLoading();
    expect(service.isLoading()).toBe(true); // Still loading

    service.stopLoading();
    expect(service.isLoading()).toBe(false); // Now stopped
  });

  it('should force stop all loading', () => {
    service.startLoading();
    service.startLoading();
    service.forceStop();
    expect(service.isLoading()).toBe(false);
  });

  it('should handle stopLoading when no requests are active', () => {
    expect(service.isLoading()).toBe(false);
    service.stopLoading(); // Should not crash or cause issues
    expect(service.isLoading()).toBe(false);
  });
});
