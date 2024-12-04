import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationTotalComponent } from './information-total.component';

describe('InformationTotalComponent', () => {
  let component: InformationTotalComponent;
  let fixture: ComponentFixture<InformationTotalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformationTotalComponent]
    });
    fixture = TestBed.createComponent(InformationTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
