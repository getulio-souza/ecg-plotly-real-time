import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgGraphComponent } from './ecg-graph.component';

describe('EcgGraphComponent', () => {
  let component: EcgGraphComponent;
  let fixture: ComponentFixture<EcgGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcgGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcgGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
