import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationClientComponent } from './configuration-client.component';

describe('ConfigurationClientComponent', () => {
  let component: ConfigurationClientComponent;
  let fixture: ComponentFixture<ConfigurationClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurationClientComponent]
    });
    fixture = TestBed.createComponent(ConfigurationClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
