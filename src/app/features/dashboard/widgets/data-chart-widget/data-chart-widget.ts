import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, afterNextRender, effect, inject, viewChild, signal } from '@angular/core';
import { Chart, ChartConfiguration, registerables, ChartType } from 'chart.js';
import { DataStore } from '../../../../core/stores/data.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

// Register Chart.js components
Chart.register(...registerables);

@Component({
    selector: 'app-data-chart-widget',
    imports: [
        MatProgressSpinnerModule,
        MatCardModule,
        MatIconModule,
        MatButton,
        MatButtonToggleModule
    ],
    templateUrl: './data-chart-widget.html',
    styleUrl: './data-chart-widget.scss'
})
export class DataChartWidget implements OnInit, AfterViewInit, OnDestroy {
    private readonly dataStore = inject(DataStore);
    private chart: Chart | null = null;

    // Chart type signal for toggling between bar and line charts
    readonly chartType = signal<ChartType>('bar');

    // Dataset visibility tracking to persist across chart type changes
    readonly datasetVisibility = signal({
        average: true,
        peak: false,
        minimum: false
    });

    // Template reference to canvas
    readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

    // Expose store signals to template
    readonly isLoading = this.dataStore.isLoading;
    readonly hasError = this.dataStore.hasError;
    readonly error = this.dataStore.error;
    readonly hasData = this.dataStore.hasData;
    readonly chartData = this.dataStore.chartData;

    constructor() {
        // Set up reactive chart initialization and updates using effect
        effect(() => {
            // Only initialize/update chart when we have canvas, data, and chart container is visible
            const canvas = this.canvasRef();
            const hasData = this.hasData();
            const chartData = this.chartData();
            
            if (canvas && hasData && chartData.labels.length > 0) {
                this.initializeChart();
            }
        });
    }

    ngOnInit(): void {
        // Load data when component initializes
        this.dataStore.loadData();
    }

    ngAfterViewInit(): void {
        this.initializeChart();
    }

    /**
     * Initialize Chart.js chart
     */
    private initializeChart(): void {
        const canvas = this.canvasRef();
        if (!canvas) return;

        const ctx = canvas.nativeElement.getContext('2d');
        if (!ctx) return;

        // Capture current visibility state before destroying existing chart
        if (this.chart) {
            this.captureDatasetVisibility();
            this.chart.destroy();
        }

        // Get current chart data and type
        const data = this.chartData();
        const currentType = this.chartType();

        // Prepare dataset based on chart type
        const datasets = data.datasets.map(dataset => ({
            ...dataset,
            // For line charts, add tension for smooth curves
            ...(currentType === 'line' && { tension: 0.4 })
        }));

        // Create reactive chart that updates with signal changes
        const config: ChartConfiguration = {
            type: currentType,
            data: {
                ...data,
                datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false,
                        text: `Hourly Value Data (${currentType.charAt(0).toUpperCase() + currentType.slice(1)} Chart)`,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 10
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: 'Time'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: false,
                            text: 'Value'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        };

        this.chart = new Chart(ctx, config);
        
        // Restore dataset visibility after chart creation
        this.restoreDatasetVisibility();
    }

    /**
     * Change chart type and reinitialize chart
     */
    changeChartType(type: ChartType): void {
        this.chartType.set(type);
    }

    /**
     * Retry loading data
     */
    retry(): void {
        this.dataStore.reload();
    }

    /**
     * Cleanup chart on component destroy
     */
    ngOnDestroy(): void {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    /**
     * Capture current dataset visibility state before destroying chart
     */
    private captureDatasetVisibility(): void {
        if (!this.chart) return;
        
        // Capture visibility for each dataset (average, peak, minimum)
        const visibility = {
            average: this.chart.isDatasetVisible(0),
            peak: this.chart.isDatasetVisible(1),
            minimum: this.chart.isDatasetVisible(2)
        };
        
        this.datasetVisibility.set(visibility);
    }

    /**
     * Restore dataset visibility after creating new chart
     */
    private restoreDatasetVisibility(): void {
        if (!this.chart) return;
        
        const visibility = this.datasetVisibility();
        
        // Apply visibility to each dataset
        this.chart.setDatasetVisibility(0, visibility.average);
        this.chart.setDatasetVisibility(1, visibility.peak);
        this.chart.setDatasetVisibility(2, visibility.minimum);
        
        this.chart.update('show');
    }
}
