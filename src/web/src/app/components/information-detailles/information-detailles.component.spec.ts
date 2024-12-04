import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationDetaillesComponent } from './information-detailles.component';

describe('InformationDetaillesComponent', () => {
  let component: InformationDetaillesComponent;
  let fixture: ComponentFixture<InformationDetaillesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformationDetaillesComponent]
    });
    fixture = TestBed.createComponent(InformationDetaillesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
