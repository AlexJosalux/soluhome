import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productoshome } from './productoshome';

describe('Productoshome', () => {
  let component: Productoshome;
  let fixture: ComponentFixture<Productoshome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productoshome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productoshome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
