import { Component, inject, computed, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
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
    private readonly breakpointObserver = inject(BreakpointObserver);
    
    /** Expose loading state to template */
    readonly isLoading = this.loadingService.isLoading;
    
    /** Check if we're on mobile/tablet using signals */
    readonly isMobile = toSignal(
        this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Small]),
        { initialValue: { matches: false, breakpoints: {} } }
    );
    
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
    
    /** Check if documentation is available (production/GitHub Pages) */
    readonly hasDocumentation = computed(() => {
        return window.location.pathname.includes('/angular-zoneless-demo/');
    });
    
    /** Get the correct documentation URL relative to runtime base URL */
    readonly documentationUrl = computed(() => {
        return `${this.baseUrl}docs/index.html`;
    });
    
    /** Show documentation link only on desktop and when docs are available */
    readonly showDocumentationLink = computed(() => {
        return this.hasDocumentation() && !(this.isMobile()?.matches ?? false);
    });
}
