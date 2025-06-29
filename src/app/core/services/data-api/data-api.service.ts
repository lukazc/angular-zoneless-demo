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
  private readonly DATA_URL = '/podaci.json';

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
