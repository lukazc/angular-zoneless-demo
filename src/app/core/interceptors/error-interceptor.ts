import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

/**
 * HTTP Error Interceptor that handles errors globally and shows user-friendly notifications
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unexpected error occurred.';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Client Error: ${error.error.message}.`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 400:
                        errorMessage = 'Bad Request - Please check your input.';
                        break;
                    case 401:
                        errorMessage = 'Unauthorized - Please log in.';
                        break;
                    case 403:
                        errorMessage = 'Forbidden - You do not have permission.';
                        break;
                    case 404:
                        errorMessage = 'Not Found - The requested resource was not found.';
                        break;
                    case 500:
                        errorMessage = 'Internal Server Error - Please try again later.';
                        break;
                    case 502:
                        errorMessage = 'Bad Gateway - Server is temporarily unavailable.';
                        break;
                    case 503:
                        errorMessage = 'Service Unavailable - Please try again later.';
                        break;
                    default:
                        errorMessage = `Server Error: ${error.status} - ${error.statusText}.`;
                }

                // Include server error message if available and meaningful
                if (error.error?.message && typeof error.error.message === 'string') {
                    errorMessage += ` (${error.error.message})`;
                }
            }

            // Show error notification
            notificationService.showSnackBar(errorMessage);

            // Log error for debugging
            console.error('HTTP Error:', {
                url: req.url,
                method: req.method,
                status: error.status,
                message: error.message,
                error: error.error
            });

            // Re-throw the error so components can handle it if needed
            return throwError(() => error);
        })
    );
};
