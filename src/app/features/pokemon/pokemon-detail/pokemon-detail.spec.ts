import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PokemonDetail } from './pokemon-detail';
import { PokemonApi } from '../../../core/services/pokemon-api/pokemon-api.service';
import { PokemonSummary } from '../../../core/models/pokemon.model';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PokemonDetail', () => {
    let component: PokemonDetail;
    let fixture: ComponentFixture<PokemonDetail>;
    let mockPokemonApi: jasmine.SpyObj<PokemonApi>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockActivatedRoute: any;

    const mockPokemon: PokemonSummary = {
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
    };

    beforeEach(async () => {
        mockPokemonApi = jasmine.createSpyObj('PokemonApi', ['getPokemonById']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        
        mockActivatedRoute = {
            snapshot: {
                paramMap: {
                    get: jasmine.createSpy('get').and.returnValue('25')
                },
                queryParams: {}
            }
        };

        await TestBed.configureTestingModule({
            imports: [PokemonDetail],
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: PokemonApi, useValue: mockPokemonApi },
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ]
        }).compileComponents();

        mockPokemonApi.getPokemonById.and.returnValue(of(mockPokemon));
        fixture = TestBed.createComponent(PokemonDetail);
        component = fixture.componentInstance;
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should load Pokemon data on initialization', async () => {
            await fixture.whenStable();
            
            expect(mockPokemonApi.getPokemonById).toHaveBeenCalledWith(25);
            expect(component.pokemon()).toEqual(mockPokemon);
            expect(component.loading()).toBe(false);
            expect(component.error()).toBeNull();
        });

        it('should handle invalid Pokemon ID', async () => {
            mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
            
            // Create a new component instance with the updated route
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [PokemonDetail],
                providers: [
                    provideZonelessChangeDetection(),
                    provideHttpClient(),
                    provideHttpClientTesting(),
                    { provide: PokemonApi, useValue: mockPokemonApi },
                    { provide: Router, useValue: mockRouter },
                    { provide: ActivatedRoute, useValue: mockActivatedRoute }
                ]
            }).compileComponents();

            const newFixture = TestBed.createComponent(PokemonDetail);
            const newComponent = newFixture.componentInstance;
            
            expect(newComponent.error()).toBe('Invalid Pokemon ID');
            expect(newComponent.loading()).toBe(false);
        });

        it('should handle Pokemon not found', async () => {
            mockPokemonApi.getPokemonById.and.returnValue(of(null));
            
            // Create a new component instance with the updated API mock
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [PokemonDetail],
                providers: [
                    provideZonelessChangeDetection(),
                    provideHttpClient(),
                    provideHttpClientTesting(),
                    { provide: PokemonApi, useValue: mockPokemonApi },
                    { provide: Router, useValue: mockRouter },
                    { provide: ActivatedRoute, useValue: mockActivatedRoute }
                ]
            }).compileComponents();

            const newFixture = TestBed.createComponent(PokemonDetail);
            const newComponent = newFixture.componentInstance;
            await newFixture.whenStable();
            
            expect(newComponent.error()).toBe('Pokemon not found');
            expect(newComponent.loading()).toBe(false);
        });

        it('should handle API errors', async () => {
            const consoleSpy = spyOn(console, 'error');
            mockPokemonApi.getPokemonById.and.returnValue(throwError(() => new Error('API Error')));
            
            // Create a new component instance with the updated API mock
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [PokemonDetail],
                providers: [
                    provideZonelessChangeDetection(),
                    provideHttpClient(),
                    provideHttpClientTesting(),
                    { provide: PokemonApi, useValue: mockPokemonApi },
                    { provide: Router, useValue: mockRouter },
                    { provide: ActivatedRoute, useValue: mockActivatedRoute }
                ]
            }).compileComponents();

            const newFixture = TestBed.createComponent(PokemonDetail);
            const newComponent = newFixture.componentInstance;
            await newFixture.whenStable();
            
            expect(newComponent.error()).toBe('Failed to load Pokemon data');
            expect(newComponent.loading()).toBe(false);
            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('Navigation', () => {
        beforeEach(async () => {
            await fixture.whenStable();
        });

        it('should navigate back to Pokemon list without query params', () => {
            component.goBack();
            
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/pokemon'], {
                queryParams: undefined
            });
        });

        it('should navigate back with preserved pagination state', () => {
            mockActivatedRoute.snapshot.queryParams = {
                returnPage: '2',
                returnLimit: '20'
            };
            
            component.goBack();
            
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/pokemon'], {
                queryParams: { page: '2', limit: '20' }
            });
        });
    });

    describe('Image URL Handling', () => {
        beforeEach(async () => {
            await fixture.whenStable();
        });

        it('should return home image URL when available', () => {
            const imageUrl = component.getImageUrl();
            
            expect(imageUrl).toBe('pikachu-home.png');
        });

        it('should fallback to front_default when home image not available', () => {
            component.pokemon.set({
                ...mockPokemon,
                sprites: { front_default: 'fallback.png' }
            });
            
            const imageUrl = component.getImageUrl();
            
            expect(imageUrl).toBe('fallback.png');
        });

        it('should return null when no Pokemon loaded', () => {
            component.pokemon.set(null);
            
            const imageUrl = component.getImageUrl();
            
            expect(imageUrl).toBeNull();
        });

        it('should return null when no images available', () => {
            component.pokemon.set({
                ...mockPokemon,
                sprites: {}
            });
            
            const imageUrl = component.getImageUrl();
            
            expect(imageUrl).toBeNull();
        });
    });
});
