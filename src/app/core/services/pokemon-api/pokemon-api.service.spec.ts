import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NamedAPIResourceList, Pokemon } from '../../models/pokemon.model';
import { PokemonApi } from './pokemon-api.service';

describe('PokemonApi', () => {
    let service: PokemonApi;
    let httpMock: HttpTestingController;
    const baseUrl = 'https://pokeapi.co/api/v2';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                provideHttpClientTesting(),
                PokemonApi,
            ]
        });
        service = TestBed.inject(PokemonApi);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getPokemonList', () => {
        it('should fetch pokemon list with default parameters', () => {
            const mockResponse: NamedAPIResourceList = {
                count: 1302,
                next: `${baseUrl}/pokemon?offset=20&limit=20`,
                previous: '',
                results: [
                    { name: 'bulbasaur', url: `${baseUrl}/pokemon/1/` },
                    { name: 'ivysaur', url: `${baseUrl}/pokemon/2/` }
                ]
            };

            service.getPokemonList().subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response.results.length).toBe(2);
            });

            const req = httpMock.expectOne(`${baseUrl}/pokemon?limit=20&offset=0`);
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('should fetch pokemon list with custom parameters', () => {
            const mockResponse: NamedAPIResourceList = {
                count: 1302,
                next: `${baseUrl}/pokemon?offset=50&limit=10`,
                previous: `${baseUrl}/pokemon?offset=30&limit=10`,
                results: []
            };

            service.getPokemonList({ limit: 10, offset: 40 }).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(`${baseUrl}/pokemon?limit=10&offset=40`);
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
    });

    describe('getPokemonById', () => {
        it('should fetch pokemon by ID', () => {
            const mockPokemon = {
                id: 1,
                name: 'bulbasaur',
                height: 7,
                weight: 69,
                types: [
                    { slot: 1, type: { name: 'grass', url: `${baseUrl}/type/12/` } },
                    { slot: 2, type: { name: 'poison', url: `${baseUrl}/type/4/` } }
                ],
                sprites: {
                    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
                }
            } as any;

            service.getPokemonById(1).subscribe(pokemon => {
                expect(pokemon.id).toBe(1);
                expect(pokemon.name).toBe('bulbasaur');
            });

            const req = httpMock.expectOne(`${baseUrl}/pokemon/1`);
            expect(req.request.method).toBe('GET');
            req.flush(mockPokemon);
        });

        it('should fetch pokemon by name', () => {
            const mockPokemon: Partial<Pokemon> = {
                id: 1,
                name: 'bulbasaur',
                height: 7,
                weight: 69
            };

            service.getPokemonById('bulbasaur').subscribe(pokemon => {
                expect(pokemon.name).toBe('bulbasaur');
            });

            const req = httpMock.expectOne(`${baseUrl}/pokemon/bulbasaur`);
            expect(req.request.method).toBe('GET');
            req.flush(mockPokemon);
        });
    });
});
