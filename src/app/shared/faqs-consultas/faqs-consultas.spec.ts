import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqsConsultas } from './faqs-consultas';

describe('FaqsConsultas', () => {
  let component: FaqsConsultas;
  let fixture: ComponentFixture<FaqsConsultas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqsConsultas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqsConsultas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
