import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFound } from './not-found';
import { provideZonelessChangeDetection } from '@angular/core';

describe('NotFound', () => {
    let component: NotFound;
    let fixture: ComponentFixture<NotFound>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotFound],
            providers: [
                provideZonelessChangeDetection()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NotFound);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
