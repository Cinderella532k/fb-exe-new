import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalChargeComponent } from './additional-charge.component';

describe('AdditionalChargeComponent', () => {
  let component: AdditionalChargeComponent;
  let fixture: ComponentFixture<AdditionalChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalChargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
