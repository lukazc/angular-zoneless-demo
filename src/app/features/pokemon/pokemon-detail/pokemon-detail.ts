import { Component, computed, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonSummary } from '../../../core/models/pokemon.model';
import { PokemonApi } from '../../../core/services/pokemon-api/pokemon-api.service';

/**
 * Pokemon Detail Component
 * 
 * Displays detailed information about a specific Pokemon
 * Includes navigation back to the list with preserved pagination state
 */
@Component({
    selector: 'app-pokemon-detail',
    imports: [
        MatButton,
        MatCardModule,
        MatProgressSpinner
    ],
    templateUrl: './pokemon-detail.html',
    styleUrl: './pokemon-detail.scss'
})
export class PokemonDetail {
    /** Injected Pokemon API service for data fetching */
    private pokemonApi = inject(PokemonApi);

    /** Injected Router service for navigation */
    private router = inject(Router);

    /** Injected ActivatedRoute service for reading URL parameters */
    private route = inject(ActivatedRoute);

    /** Signal containing the Pokemon data */
    pokemon = signal<PokemonSummary | null>(null);

    /** Signal indicating whether data is currently being loaded */
    loading = signal(true);

    /** Signal for any error that occurred during loading */
    error = signal<string | null>(null);

    /** Computed signal for the Pokemon ID from the route */
    pokemonId = computed(() => {
        const id = this.route.snapshot.paramMap.get('id');
        return id ? parseInt(id, 10) : null;
    });

    constructor() {
        this.loadPokemon();
    }

    /**
     * Loads Pokemon data from the API based on the route parameter
     */
    private loadPokemon(): void {
        const id = this.pokemonId();
        if (!id) {
            this.error.set('Invalid Pokemon ID');
            this.loading.set(false);
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        this.pokemonApi.getPokemonById(id).subscribe({
            next: (pokemon) => {
                if (pokemon) {
                    this.pokemon.set(pokemon);
                } else {
                    this.error.set('Pokemon not found');
                }
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading pokemon:', error);
                this.error.set('Failed to load Pokemon data');
                this.loading.set(false);
            }
        });
    }

    /**
     * Navigates back to the Pokemon list
     * Preserves pagination state from query parameters if available
     */
    goBack(): void {
        const queryParams = this.route.snapshot.queryParams;
        const navigationParams: any = {};

        // Restore pagination state if available
        if (queryParams['returnPage']) {
            navigationParams.page = queryParams['returnPage'];
        }
        if (queryParams['returnLimit']) {
            navigationParams.limit = queryParams['returnLimit'];
        }

        this.router.navigate(['/pokemon'], {
            queryParams: Object.keys(navigationParams).length > 0 ? navigationParams : undefined
        });
    }

    /**
     * Gets the best available image URL for the Pokemon
     * @returns The image URL or null if not available
     */
    getImageUrl(): string | null {
        const pokemon = this.pokemon();
        if (!pokemon) return null;

        return pokemon.sprites?.other?.home?.front_default ||
            pokemon.sprites?.front_default ||
            null;
    }
}
