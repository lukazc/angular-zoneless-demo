import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { App } from './app';

// Mock components for testing
@Component({ template: 'Dashboard Mock' })
class MockDashboard { }

@Component({ template: 'Pokemon Mock' })
class MockPokemon { }

describe('App', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [App],
            providers: [
                provideZonelessChangeDetection(),
                provideRouter([
                    { path: 'dashboard', component: MockDashboard },
                    { path: 'pokemon', component: MockPokemon },
                    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
                ])
            ]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(App);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should render navigation toolbar', async () => {
        const fixture = TestBed.createComponent(App);
        await fixture.whenStable();

        const toolbar = fixture.debugElement.query(By.css('mat-toolbar'));
        expect(toolbar).toBeTruthy();
        expect(toolbar.nativeElement.classList.contains('app-header')).toBe(true);
    });

    it('should render navigation links', async () => {
        const fixture = TestBed.createComponent(App);
        await fixture.whenStable();

        const navLinks = fixture.debugElement.queryAll(By.css('a[routerLink]'));
        expect(navLinks.length).toBe(2);
    });

    it('should render router outlet', async () => {
        const fixture = TestBed.createComponent(App);
        await fixture.whenStable();

        const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
        expect(routerOutlet).toBeTruthy();
    });

});
