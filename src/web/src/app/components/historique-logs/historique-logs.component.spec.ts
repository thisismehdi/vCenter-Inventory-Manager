import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueLogsComponent } from './historique-logs.component';

describe('HistoriqueLogsComponent', () => {
  let component: HistoriqueLogsComponent;
  let fixture: ComponentFixture<HistoriqueLogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueLogsComponent]
    });
    fixture = TestBed.createComponent(HistoriqueLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
