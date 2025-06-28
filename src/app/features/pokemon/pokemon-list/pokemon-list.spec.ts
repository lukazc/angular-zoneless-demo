import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonList } from './pokemon-list';
import { provideZonelessChangeDetection } from '@angular/core';

describe('PokemonList', () => {
    let component: PokemonList;
    let fixture: ComponentFixture<PokemonList>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PokemonList],
            providers: [
                provideZonelessChangeDetection()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PokemonList);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
