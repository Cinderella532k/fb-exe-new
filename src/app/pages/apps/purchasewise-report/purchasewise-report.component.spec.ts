import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasewiseReportComponent } from './purchasewise-report.component';

describe('PurchasewiseReportComponent', () => {
  let component: PurchasewiseReportComponent;
  let fixture: ComponentFixture<PurchasewiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasewiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasewiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
