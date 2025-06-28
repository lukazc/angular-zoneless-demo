import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NotFound } from './not-found';
import { provideRouter } from '@angular/router';

describe('NotFound', () => {
    let fixture: ComponentFixture<NotFound>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotFound],
            providers: [
                provideZonelessChangeDetection(),
                provideRouter([]),
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NotFound);
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should display "Page Not Found" title', () => {
        const title = fixture.debugElement.query(By.css('.error-title'));
        expect(title).toBeTruthy();
    });

    it('should have a home button', () => {
        const button = fixture.debugElement.query(By.css('.home-button'));
        expect(button).toBeTruthy();
    });
});
