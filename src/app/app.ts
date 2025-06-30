import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoadingService } from './core/services/loading.service';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        MatToolbar,
        MatIcon,
        MatButton,
        MatProgressBar
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    private readonly loadingService = inject(LoadingService);
    
    /** Expose loading state to template */
    readonly isLoading = this.loadingService.isLoading;
}
