import { Component, computed, inject, signal, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { PokemonSummary } from '../../../core/models/pokemon.model';
import { PokemonApi } from '../../../core/services/pokemon-api/pokemon-api.service';

/**
 * Pokemon List Component
 * 
 * Displays a paginated table of Pokemon data.
 * Uses Angular signals for reactive state management.
 */
@Component({
  selector: 'app-pokemon-list',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.scss'
})
export class PokemonList {
  /** Injected Pokemon API service for data fetching */
  private pokemonApi = inject(PokemonApi);
  
  /** Injected Router service for navigation */
  private router = inject(Router);
  
  /** Injected ActivatedRoute service for reading URL parameters */
  private route = inject(ActivatedRoute);
  
  /** Signal containing the current page of Pokemon data */
  pokemonData = signal<PokemonSummary[]>([]);
  
  /** Signal for the current page index (0-based) */
  currentPage = signal(0);
  
  /** Signal for the number of items per page */
  pageSize = signal(10);
  
  /** Signal for the total number of Pokemon records available */
  totalRecords = signal(0);
  
  /** Signal indicating whether data is currently being loaded */
  loading = signal(false);
  
  /** Signal for detecting mobile screen size */
  isMobile = signal(false);
  
  /** Array of column identifiers to be displayed in the table */
  displayedColumns = ['id', 'image', 'name', 'height', 'weight', 'types'];
  
  /** Array of column identifiers for mobile view (reduced columns) */
  displayedColumnsMobile = ['image', 'name', 'types'];
  
  /** Computed signal that returns appropriate columns based on screen size */
  currentDisplayedColumns = computed(() => 
    this.isMobile() ? this.displayedColumnsMobile : this.displayedColumns
  );
  
  /** Computed signal that calculates the current offset for pagination */
  currentOffset = computed(() => this.currentPage() * this.pageSize());

  /**
   * Component constructor
   * Initializes URL parameter reading, mobile detection, and loads initial data
   */
  constructor() {
    // Initialize mobile detection
    this.checkMobileScreen();
    
    // Read initial URL parameters
    this.initializeFromUrlParams();
    
    // Load initial Pokemon data
    this.loadPokemon();
  }

  /**
   * HostListener for window resize events
   * Updates mobile state when screen size changes
   */
  @HostListener('window:resize')
  onResize(): void {
    this.checkMobileScreen();
  }

  /**
   * Initializes pagination state from URL query parameters
   */
  private initializeFromUrlParams(): void {
    const queryParams = this.route.snapshot.queryParams;
    
    if (queryParams['page']) {
      const page = parseInt(queryParams['page'], 10);
      if (!isNaN(page) && page >= 0) {
        this.currentPage.set(page);
      }
    }
    
    if (queryParams['limit']) {
      const limit = parseInt(queryParams['limit'], 10);
      if (!isNaN(limit) && limit > 0) {
        this.pageSize.set(limit);
      }
    }
  }

  /**
   * Updates URL query parameters to reflect current pagination state
   */
  private updateUrlParams(): void {
    const queryParams = {
      page: this.currentPage(),
      limit: this.pageSize(),
      offset: this.currentOffset()
    };

    // Only include page if it's not 0
    if (queryParams.page === 0) {
      delete (queryParams as any).page;
    }

    // Only include limit if it's not the default (10)
    if (queryParams.limit === 10) {
      delete (queryParams as any).limit;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  /**
   * Loads Pokemon data from the API based on current pagination settings
   * Updates the pokemonData, totalRecords, and loading signals
   */
  loadPokemon(): void {
    this.loading.set(true);
    const offset = this.currentOffset();
    
    this.pokemonApi.getPokemonList({ 
      limit: this.pageSize(), 
      offset 
    }).subscribe({
      next: (result) => {
        this.pokemonData.set(result.pokemon);
        this.totalRecords.set(result.totalCount);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading pokemon:', error);
        this.loading.set(false);
      }
    });
  }

  /**
   * Handles pagination change events from the Material paginator
   * Updates the current page, URL parameters, and reloads Pokemon data
   * 
   * @param event - The page event containing the new page index and other pagination info
   */
  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    if (event.pageSize !== this.pageSize()) {
      this.pageSize.set(event.pageSize);
    }
    this.updateUrlParams();
    this.loadPokemon();
  }


  /**
   * Extracts the best available image URL from Pokemon sprite data
   * Prioritizes high-quality images from the 'home' collection, falls back to default sprites
   * 
   * @param pokemon - The Pokemon object containing sprite information
   * @returns The URL of the Pokemon image, or null if no image is available
   */
  getImageUrl(pokemon: PokemonSummary): string | null {
    return pokemon.sprites?.other?.home?.front_default || 
           pokemon.sprites?.front_default || 
           null;
  }

  /**
   * Handles row click events to navigate to Pokemon detail page
   * Preserves current pagination state in URL parameters
   * 
   * @param pokemon - The Pokemon object that was clicked
   */
  onRowClick(pokemon: PokemonSummary): void {
    this.router.navigate(['/pokemon', pokemon.id], {
      queryParams: {
        returnPage: this.currentPage(),
        returnLimit: this.pageSize()
      }
    });
  }

  /**
   * Checks if the current screen size is mobile
   */
  private checkMobileScreen(): void {
    if (typeof window !== 'undefined') {
      this.isMobile.set(window.innerWidth < 768);
    }
  }
}
