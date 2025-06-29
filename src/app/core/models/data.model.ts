/**
 * Data models for data from podaci.json
 * These models represent time-series data in 15-minute and hourly formats
 */

/**
 * Individual data point representing a 15-minute interval measurement
 */
export interface DataPoint {
  /** Start timestamp of the measurement interval */
  timestampStart: string;
  
  /** End timestamp of the measurement interval */
  timestampEnd: string;
  
  /** Value for this interval */
  value: number;
}

/**
 * Raw data structure from podaci.json
 * Key is hour timestamp, value is array of 15-minute intervals within that hour
 */
export interface RawDataResponse {
  [hourKey: string]: DataPoint[];
}

/**
 * Processed hourly data point with aggregated statistics
 */
export interface HourlyDataPoint {
  /** ISO timestamp for the hour */
  timestamp: string;
  
  /** Formatted hour string for display (HH:MM) */
  hour: string;
  
  /** Average value for the hour */
  averageValue: number;
  
  /** Number of data points used in the average calculation */
  dataPointsCount: number;

  /** Minimum value in the hour */
  minValue: number;

  /** Maximum value in the hour */
  maxValue: number;
}

/**
 * Chart.js dataset configuration for data visualization
 */
export interface ChartDataset {
  /** Display label for the dataset */
  label: string;
  
  /** Array of data values */
  data: number[];
  
  /** Line/border color */
  borderColor: string;
  
  /** Fill/background color */
  backgroundColor: string;
  
  /** Line tension for smooth curves (optional, for line charts) */
  tension?: number;
}

/**
 * Complete chart configuration for Chart.js
 */
export interface ChartData {
  /** X-axis labels (time values) */
  labels: string[];
  
  /** Array of datasets to display */
  datasets: ChartDataset[];
}
