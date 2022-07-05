import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalChargesComponent } from './additional-charges.component';

describe('AdditionalChargesComponent', () => {
  let component: AdditionalChargesComponent;
  let fixture: ComponentFixture<AdditionalChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
