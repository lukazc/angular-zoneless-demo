import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PokemonListParams, PokemonSummary } from '../../models/pokemon.model';


@Injectable({
    providedIn: 'root'
})
export class PokemonApi {
    private readonly http = inject(HttpClient);
    private readonly graphqlUrl = 'https://graphql.pokeapi.co/v1beta2';

    /**
     * Fetches a paginated list of Pokemon with summary fields using the PokeAPI GraphQL endpoint.
     *
     * @param params Optional pagination settings: limit (number of results) and offset (start index).
     * @returns Observable emitting an array of PokemonSummary objects.
     */
    getPokemonList(params: PokemonListParams = {}): Observable<PokemonSummary[]> {
        const { limit = 20, offset = 0 } = params;
        const query = `
            query getPokemonList($limit: Int!, $offset: Int!) {
                pokemon(limit: $limit, offset: $offset) {
                    id
                    name
                    height
                    weight
                    pokemontypes { type { name } }
                    pokemonsprites { sprites }
                }
            }
        `;
        const body = {
            query,
            variables: { limit, offset },
            operationName: 'getPokemonList'
        };
        return this.http.post<any>(this.graphqlUrl, body).pipe(
            map(res => {
                if (res.errors && res.errors.length) {
                    throw new Error(res.errors.map((e: any) => e.message).join('; '));
                }
                return res.data.pokemon.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    height: p.height,
                    weight: p.weight,
                    types: p.pokemontypes.map((t: any) => t.type.name),
                    sprites: p.pokemonsprites?.[0]?.sprites ?? null
                }));
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Fetch detailed Pokemon data by ID using the GraphQL endpoint.
     * @param id Pokemon ID (number).
     * @returns Observable of a single PokemonSummary object, or null if not found.
     */
    getPokemonById(id: number): Observable<PokemonSummary | null> {
        const query = `
            query getPokemon($id: Int) {
                pokemon(where: { id: { _eq: $id } }) {
                    id
                    name
                    height
                    weight
                    pokemontypes { type { name } }
                    pokemonsprites { sprites }
                }
            }
        `;
        const variables = { id };
        const body = {
            query,
            variables,
            operationName: 'getPokemon'
        };
        return this.http.post<any>(this.graphqlUrl, body).pipe(
            map(res => {
                if (res.errors && res.errors.length) {
                    throw new Error(res.errors.map((e: any) => e.message).join('; '));
                }
                const p = res.data.pokemon[0];
                if (!p) return null;
                return {
                    id: p.id,
                    name: p.name,
                    height: p.height,
                    weight: p.weight,
                    types: p.pokemontypes.map((t: any) => t.type.name),
                    sprites: p.pokemonsprites?.[0]?.sprites ?? null
                };
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Handle HTTP errors from API requests.
     * @param error HttpErrorResponse from HttpClient.
     * @returns Observable that throws a user-friendly error.
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An unknown error occurred';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Client Error: ${error.error.message}`;
        } else {
            errorMessage = `Server Error: ${error.status} - ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
    }
}
