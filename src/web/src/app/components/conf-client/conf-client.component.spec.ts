import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfClientComponent } from './conf-client.component';

describe('ConfClientComponent', () => {
  let component: ConfClientComponent;
  let fixture: ComponentFixture<ConfClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfClientComponent]
    });
    fixture = TestBed.createComponent(ConfClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
