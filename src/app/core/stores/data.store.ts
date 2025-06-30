import { Injectable, computed, inject, signal } from "@angular/core";
import { catchError, of } from "rxjs";
import {
    ChartData,
    HourlyDataPoint,
    RawDataResponse
} from "../models/data.model";
import { DataApi } from "../services/data-api/data-api.service";

/**
 * Data store for table and chart
 */
@Injectable({ providedIn: 'root' })
export class DataStore {
    private readonly dataApi = inject(DataApi);

    /** Loading state */
    private readonly _isLoading = signal(false);

    /** Error state */
    private readonly _error = signal<string | null>(null);

    /** Hourly data for the table widget */
    private readonly _hourlyData = signal<HourlyDataPoint[]>([]);

    /** Chart data for the chart widget */
    private readonly _chartData = signal<ChartData>({ labels: [], datasets: [] });

    // Public readonly signals
    readonly isLoading = this._isLoading.asReadonly();
    readonly error = this._error.asReadonly();
    readonly hourlyData = this._hourlyData.asReadonly();
    readonly chartData = this._chartData.asReadonly();

    // Computed signals
    readonly hasError = computed(() => this._error() !== null);
    readonly hasData = computed(() => this._hourlyData().length > 0);
    readonly dataCount = computed(() => this._hourlyData().length);

    /**
     * Loads raw data once and processes it
     */
    loadData(): void {
        if (this._isLoading()) return;

        this._isLoading.set(true);
        this._error.set(null);

        this.dataApi.loadRawData().pipe(
            catchError(error => {
                this._error.set('Failed to load data');
                this._isLoading.set(false);
                return of({});
            })
        ).subscribe(rawData => {
            // Process raw data into hourly data
            const hourlyData = this.convertToHourlyAverages(rawData);
            this._hourlyData.set(hourlyData);

            // Format hourly data for chart
            const chartData = this.formatForChart(hourlyData);
            this._chartData.set(chartData);

            this._isLoading.set(false);
        });
    }

    /**
     * Reloads all data
     */
    reload(): void {
        this.loadData();
    }

    /**
     * Clears all data
     */
    clear(): void {
        this._hourlyData.set([]);
        this._chartData.set({ labels: [], datasets: [] });
        this._error.set(null);
        this._isLoading.set(false);
    }

    /**
     * Converts 15-minute interval data to hourly averages
     * @param rawData Raw data from JSON file
     * @returns Array of hourly data points
     */
    private convertToHourlyAverages(rawData: RawDataResponse): HourlyDataPoint[] {
        const hourlyData: HourlyDataPoint[] = [];

        for (const [hourKey, dataPoints] of Object.entries(rawData)) {
            if (!dataPoints || dataPoints.length === 0) continue;

            const values = dataPoints.map(point => point.value);
            const averageValue = values.reduce((sum, val) => sum + val, 0) / values.length;
            const minValue = Math.min(...values);
            const maxValue = Math.max(...values);

            // Extract hour from timestamp for display
            const hourTimestamp = new Date(hourKey);
            const hourString = hourTimestamp.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            hourlyData.push({
                timestamp: hourKey,
                hour: hourString,
                averageValue: Math.round(averageValue * 100) / 100,
                dataPointsCount: dataPoints.length,
                minValue: Math.round(minValue * 100) / 100,
                maxValue: Math.round(maxValue * 100) / 100
            });
        }

        // Sort by timestamp
        return hourlyData.sort((a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    }

    /**
     * Formats hourly data for Chart.js
     * @param hourlyData Processed hourly data
     * @returns Chart.js compatible data structure
     */
    private formatForChart(hourlyData: HourlyDataPoint[]): ChartData {
        return {
            labels: hourlyData.map(point => point.hour),
            datasets: [
                {
                    label: 'Average Value',
                    data: hourlyData.map(point => point.averageValue),
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.7)'
                },
                {
                    label: 'Peak Value',
                    data: hourlyData.map(point => point.maxValue),
                    borderColor: '#d32f2f',
                    backgroundColor: 'rgba(211, 47, 47, 0.7)'
                },
                {
                    label: 'Minimum Value',
                    data: hourlyData.map(point => point.minValue),
                    borderColor: '#388e3c',
                    backgroundColor: 'rgba(56, 142, 60, 0.7)'
                }
            ]
        };
    }
}
