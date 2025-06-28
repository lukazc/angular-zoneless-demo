import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
    NamedAPIResourceList,
    Pokemon,
    PokemonListParams,
    PokemonSummary,
    PokemonType
} from '../../models/pokemon.model';

@Injectable({
    providedIn: 'root'
})
export class PokemonApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'https://pokeapi.co/api/v2';

    /**
     * Fetch a paginated list of Pokemon
     */
    getPokemonList(params: PokemonListParams = {}): Observable<NamedAPIResourceList> {
        const { limit = 20, offset = 0 } = params;
        const url = `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`;

        return this.http.get<NamedAPIResourceList>(url).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Fetch detailed Pokemon data by ID or name
     */
    getPokemonById(id: number | string): Observable<Pokemon> {
        const url = `${this.baseUrl}/pokemon/${id}`;

        return this.http.get<Pokemon>(url).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Map full Pokemon data to summary for list display
     */
    private mapToPokemonSummary(pokemon: Pokemon): PokemonSummary {
        return {
            id: pokemon.id,
            name: pokemon.name,
            url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
            height: pokemon.height,
            weight: pokemon.weight,
            types: pokemon.types.map((type: PokemonType) => type.type.name),
            sprite: pokemon.sprites.front_default
        };
    }

    /**
     * Handle HTTP errors
     */
    private handleError = (error: HttpErrorResponse): Observable<never> => {
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Client Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Server Error: ${error.status} - ${error.message}`;
        }

        console.error('Pokemon API Error:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
    };
}
