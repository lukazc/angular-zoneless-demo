import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Service for displaying notifications using Angular Material's MatSnackBar
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly snackBar = inject(MatSnackBar);

    /**
     * Show an error notification
     */
    showSnackBar(message: string, duration = 8000): void {
        this.snackBar.open(message, 'Close', {
            duration,
            horizontalPosition: 'end',
            verticalPosition: 'top'
        });
    }

    /**
     * Dismiss all active notifications
     */
    dismiss(): void {
        this.snackBar.dismiss();
    }
}
