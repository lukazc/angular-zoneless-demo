import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { PokemonSummary } from '../../../core/models/pokemon.model';
import { PokemonApi } from '../../../core/services/pokemon-api/pokemon-api.service';
import { PokemonList } from './pokemon-list';

describe('PokemonList', () => {
    let component: PokemonList;
    let fixture: ComponentFixture<PokemonList>;
    let mockPokemonApi: jasmine.SpyObj<PokemonApi>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockActivatedRoute: any;

    const mockPokemonData: PokemonSummary[] = [
        {
            id: 1,
            name: 'bulbasaur',
            displayName: 'Bulbasaur',
            height: 7,
            weight: 69,
            types: ['grass', 'poison'],
            sprites: {
                front_default: 'bulbasaur.png',
                other: { home: { front_default: 'bulbasaur-home.png' } }
            }
        },
        {
            id: 25,
            name: 'pikachu',
            displayName: 'Pikachu',
            height: 4,
            weight: 60,
            types: ['electric'],
            sprites: {
                front_default: 'pikachu.png',
                other: { home: { front_default: 'pikachu-home.png' } }
            }
        }
    ];

    beforeEach(async () => {
        mockPokemonApi = jasmine.createSpyObj('PokemonApi', ['getPokemonList']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        mockActivatedRoute = {
            snapshot: {
                queryParams: {}
            }
        };

        await TestBed.configureTestingModule({
            imports: [PokemonList],
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: PokemonApi, useValue: mockPokemonApi },
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ]
        }).compileComponents();

        mockPokemonApi.getPokemonList.and.returnValue(of({
            pokemon: mockPokemonData,
            totalCount: 100
        }));

        fixture = TestBed.createComponent(PokemonList);
        component = fixture.componentInstance;
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize with default pagination values', () => {
            expect(component.currentPage()).toBe(0);
            expect(component.pageSize()).toBe(10);
            expect(component.loading()).toBe(false);
            expect(component.totalRecords()).toBe(100);
        });

        it('should load Pokemon data on initialization', async () => {
            await fixture.whenStable();

            expect(mockPokemonApi.getPokemonList).toHaveBeenCalledWith({
                limit: 10,
                offset: 0
            });
            expect(component.pokemonData()).toEqual(mockPokemonData);
            expect(component.totalRecords()).toBe(100);
        });
    });

    describe('Mobile Detection', () => {
        it('should detect desktop screen size', () => {
            spyOnProperty(window, 'innerWidth', 'get').and.returnValue(1024);
            component['checkMobileScreen']();

            expect(component.isMobile()).toBe(false);
            expect(component.currentDisplayedColumns()).toEqual([
                'id', 'image', 'name', 'height', 'weight', 'types'
            ]);
        });

        it('should detect mobile screen size', () => {
            spyOnProperty(window, 'innerWidth', 'get').and.returnValue(500);
            component['checkMobileScreen']();

            expect(component.isMobile()).toBe(true);
            expect(component.currentDisplayedColumns()).toEqual([
                'image', 'name', 'types'
            ]);
        });
    });

    describe('Pagination', () => {
        beforeEach(async () => {
            await fixture.whenStable();
        });

        it('should handle page change', () => {
            const pageEvent = { pageIndex: 2, pageSize: 10, length: 100 };

            component.onPageChange(pageEvent);

            expect(component.currentPage()).toBe(2);
            expect(mockPokemonApi.getPokemonList).toHaveBeenCalledWith({
                limit: 10,
                offset: 20
            });
        });

        it('should handle page size change', () => {
            const pageEvent = { pageIndex: 1, pageSize: 20, length: 100 };

            component.onPageChange(pageEvent);

            expect(component.pageSize()).toBe(20);
            expect(component.currentPage()).toBe(1);
            expect(mockPokemonApi.getPokemonList).toHaveBeenCalledWith({
                limit: 20,
                offset: 20
            });
        });

        it('should calculate correct offset', () => {
            component.currentPage.set(3);
            component.pageSize.set(15);

            expect(component.currentOffset()).toBe(45);
        });
    });

    describe('Navigation', () => {
        beforeEach(async () => {
            await fixture.whenStable();
        });

        it('should navigate to Pokemon detail on row click', () => {
            const pokemon = mockPokemonData[0];

            component.onRowClick(pokemon);

            expect(mockRouter.navigate).toHaveBeenCalledWith(['/pokemon', 1], {
                queryParams: {
                    returnPage: 0,
                    returnLimit: 10
                }
            });
        });

        it('should preserve pagination state in navigation', () => {
            component.currentPage.set(2);
            component.pageSize.set(20);
            const pokemon = mockPokemonData[1];

            component.onRowClick(pokemon);

            expect(mockRouter.navigate).toHaveBeenCalledWith(['/pokemon', 25], {
                queryParams: {
                    returnPage: 2,
                    returnLimit: 20
                }
            });
        });
    });

    describe('Image URL Handling', () => {
        it('should return home image URL when available', () => {
            const pokemon = mockPokemonData[0];

            const imageUrl = component.getImageUrl(pokemon);

            expect(imageUrl).toBe('bulbasaur-home.png');
        });

        it('should fallback to front_default when home image not available', () => {
            const pokemon: PokemonSummary = {
                ...mockPokemonData[0],
                sprites: { front_default: 'fallback.png' }
            };

            const imageUrl = component.getImageUrl(pokemon);

            expect(imageUrl).toBe('fallback.png');
        });

        it('should return null when no images available', () => {
            const pokemon: PokemonSummary = {
                ...mockPokemonData[0],
                sprites: {}
            };

            const imageUrl = component.getImageUrl(pokemon);

            expect(imageUrl).toBeNull();
        });
    });

    describe('Error Handling', () => {
        it('should handle API errors gracefully', () => {
            const consoleSpy = spyOn(console, 'error');
            mockPokemonApi.getPokemonList.and.returnValue(throwError(() => new Error('API Error')));

            component.loadPokemon();

            expect(component.loading()).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith('Error loading pokemon:', jasmine.any(Error));
        });
    });
});
