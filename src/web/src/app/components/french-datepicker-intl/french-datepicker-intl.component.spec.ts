import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrenchDatepickerIntlComponent } from './french-datepicker-intl.component';

describe('FrenchDatepickerIntlComponent', () => {
  let component: FrenchDatepickerIntlComponent;
  let fixture: ComponentFixture<FrenchDatepickerIntlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrenchDatepickerIntlComponent]
    });
    fixture = TestBed.createComponent(FrenchDatepickerIntlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
