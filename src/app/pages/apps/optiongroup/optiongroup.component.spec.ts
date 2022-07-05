import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptiongroupComponent } from './optiongroup.component';

describe('OptiongroupComponent', () => {
  let component: OptiongroupComponent;
  let fixture: ComponentFixture<OptiongroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptiongroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptiongroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
