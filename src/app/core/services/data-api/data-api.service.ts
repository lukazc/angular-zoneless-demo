import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { 
  RawDataResponse, 
} from '../../models/data.model';

/**
 * Service for loading data from podaci.json
 */
@Injectable({
  providedIn: 'root'
})
export class DataApi {
  private readonly http = inject(HttpClient);

  /**
   * Get the actual base URL where the app is deployed at runtime
   */
  private get baseUrl(): string {
    const currentPath = window.location.pathname;
    
    // If we're on GitHub Pages, the path will include the repo name
    if (currentPath.includes('/angular-zoneless-demo/')) {
      const basePath = currentPath.substring(0, currentPath.indexOf('/angular-zoneless-demo/') + '/angular-zoneless-demo/'.length);
      return `${window.location.origin}${basePath}`;
    }
    
    // For local development or other deployments
    return `${window.location.origin}/`;
  }

  private get DATA_URL(): string {
    return `${this.baseUrl}podaci.json`;
  }

  /**
   * Loads raw data from podaci.json
   * @returns Observable of raw data structure
   */
  loadRawData(): Observable<RawDataResponse> {
    return this.http.get<RawDataResponse>(this.DATA_URL).pipe(
      catchError(error => {
        console.error('Failed to load podaci.json:', error);
        return of({});
      })
    );
  }

}
