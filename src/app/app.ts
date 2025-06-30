import { Component, inject, computed, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
    private readonly document = inject(DOCUMENT);
    private readonly breakpointObserver = inject(BreakpointObserver);
    
    /** Expose loading state to template */
    readonly isLoading = this.loadingService.isLoading;
    
    /** Check if we're on mobile/tablet using signals */
    readonly isMobile = toSignal(
        this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Small]),
        { initialValue: { matches: false, breakpoints: {} } }
    );
    
    /** Check if documentation is available (production/GitHub Pages) */
    readonly hasDocumentation = computed(() => {
        const baseHref = this.document.querySelector('base')?.getAttribute('href') || '/';
        return baseHref.includes('/angular-zoneless-demo/');
    });
    
    /** Show documentation link only on desktop and when docs are available */
    readonly showDocumentationLink = computed(() => {
        return this.hasDocumentation() && !(this.isMobile()?.matches ?? false);
    });
}
