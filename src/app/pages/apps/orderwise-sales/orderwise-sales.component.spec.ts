import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderwiseSalesComponent } from './orderwise-sales.component';

describe('OrderwiseSalesComponent', () => {
  let component: OrderwiseSalesComponent;
  let fixture: ComponentFixture<OrderwiseSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderwiseSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderwiseSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
