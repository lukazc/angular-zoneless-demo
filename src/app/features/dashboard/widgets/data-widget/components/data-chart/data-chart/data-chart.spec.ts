import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataChart } from './data-chart';

describe('DataChart', () => {
  let component: DataChart;
  let fixture: ComponentFixture<DataChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
