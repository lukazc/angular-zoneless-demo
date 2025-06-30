import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';

import { provideZonelessChangeDetection } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { errorInterceptor } from './error-interceptor';

describe('errorInterceptor', () => {
    let notificationService: NotificationService;
    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() => errorInterceptor(req, next));

    beforeEach(() => {
        const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);

        TestBed.configureTestingModule({
            providers: [
                provideZonelessChangeDetection(),
                { provide: NotificationService, useValue: notificationSpy }
            ]
        });

        notificationService = TestBed.inject(NotificationService);
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });

    it('should handle 404 error and show notification', (done) => {
        const req = new HttpRequest('GET', '/test');
        const errorResponse = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });
        const mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => errorResponse));

        interceptor(req, mockNext).subscribe({
            error: (error) => {
                expect(notificationService.showSnackBar).toHaveBeenCalledWith(
                    'Not Found - The requested resource was not found.'
                );
                expect(error).toBe(errorResponse);
                done();
            }
        });
    });

    it('should handle 500 error and show notification', (done) => {
        const req = new HttpRequest('GET', '/test');
        const errorResponse = new HttpErrorResponse({
            error: 'Internal Server Error',
            status: 500,
            statusText: 'Internal Server Error'
        });
        const mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => errorResponse));

        interceptor(req, mockNext).subscribe({
            error: (error) => {
                expect(notificationService.showSnackBar).toHaveBeenCalledWith(
                    'Internal Server Error - Please try again later.'
                );
                expect(error).toBe(errorResponse);
                done();
            }
        });
    });

    it('should handle client-side error and show notification', (done) => {
        const req = new HttpRequest('GET', '/test');
        const clientError = new ErrorEvent('Network error', {
            message: 'Connection failed'
        });
        const errorResponse = new HttpErrorResponse({
            error: clientError,
            status: 0,
            statusText: 'Unknown Error'
        });
        const mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => errorResponse));

        interceptor(req, mockNext).subscribe({
            error: (error) => {
                expect(notificationService.showSnackBar).toHaveBeenCalledWith(
                    'Client Error: Connection failed.'
                );
                expect(error).toBe(errorResponse);
                done();
            }
        });
    });

    it('should handle unknown error status and show generic message', (done) => {
        const req = new HttpRequest('GET', '/test');
        const errorResponse = new HttpErrorResponse({
            error: 'Unknown error',
            status: 418,
            statusText: "I'm a teapot"
        });
        const mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => errorResponse));

        interceptor(req, mockNext).subscribe({
            error: (error) => {
                expect(notificationService.showSnackBar).toHaveBeenCalledWith(
                    "Server Error: 418 - I'm a teapot."
                );
                expect(error).toBe(errorResponse);
                done();
            }
        });
    });
});
