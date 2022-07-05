import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthwiseSalesComponent } from './monthwise-sales.component';

describe('MonthwiseSalesComponent', () => {
  let component: MonthwiseSalesComponent;
  let fixture: ComponentFixture<MonthwiseSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthwiseSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthwiseSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
