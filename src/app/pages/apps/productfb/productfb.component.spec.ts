import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductfbComponent } from './productfb.component';

describe('ProductfbComponent', () => {
  let component: ProductfbComponent;
  let fixture: ComponentFixture<ProductfbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductfbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductfbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
