import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataWidget } from './data-widget';

describe('DataWidget', () => {
  let component: DataWidget;
  let fixture: ComponentFixture<DataWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
