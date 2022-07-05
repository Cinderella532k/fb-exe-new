import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionwiseReportComponent } from './productionwise-report.component';

describe('ProductionwiseReportComponent', () => {
  let component: ProductionwiseReportComponent;
  let fixture: ComponentFixture<ProductionwiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionwiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionwiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
