import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PokemonApi } from './pokemon-api.service';

describe('PokemonApi', () => {
    let service: PokemonApi;
    let httpMock: HttpTestingController;
    const graphqlUrl = 'https://graphql.pokeapi.co/v1beta2';

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
        it('should fetch and map pokemon list with default parameters', () => {
            const mockGraphQLResponse = {
                data: {
                    pokemon: [
                        {
                            id: 25,
                            name: 'pikachu',
                            height: 4,
                            weight: 60,
                            pokemontypes: [
                                { type: { name: 'electric' } }
                            ],
                            pokemonsprites: [
                                { sprites: { other: { home: { front_default: 'pikachu.png', front_shiny: 'pikachu-shiny.png' } }, versions: { 'generation-i': { red: { front_default: 'red.png' } } } } }
                            ]
                        }
                    ]
                }
            };
            service.getPokemonList().subscribe(list => {
                expect(list.length).toBe(1);
                expect(list[0]).toEqual({
                    id: 25,
                    name: 'pikachu',
                    height: 4,
                    weight: 60,
                    types: ['electric'],
                    sprites: mockGraphQLResponse.data.pokemon[0].pokemonsprites[0].sprites
                });
            });
            const req = httpMock.expectOne(graphqlUrl);
            expect(req.request.method).toBe('POST');
            req.flush(mockGraphQLResponse);
        });
    });

    describe('getPokemonById', () => {
        it('should fetch and map pokemon by ID', () => {
            const mockGraphQLResponse = {
                data: {
                    pokemon: [
                        {
                            id: 25,
                            name: 'pikachu',
                            height: 4,
                            weight: 60,
                            pokemontypes: [
                                { type: { name: 'electric' } }
                            ],
                            pokemonsprites: [
                                { sprites: { other: { home: { front_default: 'pikachu.png', front_shiny: 'pikachu-shiny.png' } } } }
                            ]
                        }
                    ]
                }
            };
            service.getPokemonById(25).subscribe(pokemon => {
                expect(pokemon).toEqual({
                    id: 25,
                    name: 'pikachu',
                    height: 4,
                    weight: 60,
                    types: ['electric'],
                    sprites: mockGraphQLResponse.data.pokemon[0].pokemonsprites[0].sprites
                });
            });
            const req = httpMock.expectOne(graphqlUrl);
            expect(req.request.method).toBe('POST');
            req.flush(mockGraphQLResponse);
        });
    });
});
