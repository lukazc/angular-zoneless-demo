import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCard } from './pokemon-card';
import { provideZonelessChangeDetection } from '@angular/core';

describe('PokemonCard', () => {
    let component: PokemonCard;
    let fixture: ComponentFixture<PokemonCard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PokemonCard],
            providers: [
                provideZonelessChangeDetection()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PokemonCard);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
