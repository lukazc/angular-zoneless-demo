import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DataStore } from '../../../../core/stores/data.store';

@Component({
    selector: 'app-data-table-widget',
    imports: [
        MatTableModule,
        MatButton,
        MatProgressSpinnerModule,
        MatCardModule,
        MatIconModule
    ],
    templateUrl: './data-table-widget.html',
    styleUrl: './data-table-widget.scss'
})
export class DataTableWidget implements OnInit {
    private readonly dataStore = inject(DataStore);

    // Expose store signals to template
    readonly hourlyData = this.dataStore.hourlyData;
    readonly isLoading = this.dataStore.isLoading;
    readonly hasError = this.dataStore.hasError;
    readonly error = this.dataStore.error;
    readonly hasData = this.dataStore.hasData;

    // Define table columns
    readonly displayedColumns = ['time', 'average', 'peak', 'minimum'];

    ngOnInit(): void {
        // Load data when component initializes
        this.dataStore.loadData();
    }

    /**
     * Retry loading data
     */
    retry(): void {
        this.dataStore.reload();
    }
}
