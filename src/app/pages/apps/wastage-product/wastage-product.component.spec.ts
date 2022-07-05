import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WastageProductComponent } from './wastage-product.component';

describe('WastageProductComponent', () => {
  let component: WastageProductComponent;
  let fixture: ComponentFixture<WastageProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WastageProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WastageProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
