import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonTable } from './pokemon-table';
import { provideZonelessChangeDetection } from '@angular/core';

describe('PokemonTable', () => {
    let component: PokemonTable;
    let fixture: ComponentFixture<PokemonTable>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PokemonTable],
            providers: [
                provideZonelessChangeDetection()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PokemonTable);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
