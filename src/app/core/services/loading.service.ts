import { Injectable, signal } from '@angular/core';

/**
 * Global loading service for managing loading states across the application
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly _isLoading = signal(false);
  private activeRequests = 0;

  /** Public readonly signal for loading state */
  readonly isLoading = this._isLoading.asReadonly();

  /**
   * Increments active request count and sets loading state
   */
  startLoading(): void {
    this.activeRequests++;
    this._isLoading.set(true);
  }

  /**
   * Decrements active request count and updates loading state
   */
  stopLoading(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this._isLoading.set(false);
    }
  }

  /**
   * Force stop all loading states
   */
  forceStop(): void {
    this.activeRequests = 0;
    this._isLoading.set(false);
  }
}
