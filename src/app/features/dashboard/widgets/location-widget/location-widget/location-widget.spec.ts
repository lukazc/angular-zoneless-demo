import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationWidget } from './location-widget';

describe('LocationWidget', () => {
  let component: LocationWidget;
  let fixture: ComponentFixture<LocationWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
