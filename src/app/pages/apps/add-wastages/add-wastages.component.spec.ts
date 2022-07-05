import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWastagesComponent } from './add-wastages.component';

describe('AddWastagesComponent', () => {
  let component: AddWastagesComponent;
  let fixture: ComponentFixture<AddWastagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWastagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWastagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
