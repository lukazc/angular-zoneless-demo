import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonDetail } from './pokemon-detail';
import { provideZonelessChangeDetection } from '@angular/core';

describe('PokemonDetail', () => {
    let component: PokemonDetail;
    let fixture: ComponentFixture<PokemonDetail>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PokemonDetail],
            providers: [
                provideZonelessChangeDetection()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PokemonDetail);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
