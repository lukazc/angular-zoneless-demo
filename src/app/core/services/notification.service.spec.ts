import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open', 'dismiss']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(NotificationService);
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show error notification', () => {
    const message = 'Error message';
    service.showSnackBar(message);

    expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Close', {
      duration: 8000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  });

  it('should dismiss notifications', () => {
    service.dismiss();
    expect(mockSnackBar.dismiss).toHaveBeenCalled();
  });

  it('should allow custom duration for success notification', () => {
    const message = 'Success message';
    const customDuration = 3000;
    service.showSnackBar(message, customDuration);

    expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Close', {
      duration: customDuration,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  });
});
