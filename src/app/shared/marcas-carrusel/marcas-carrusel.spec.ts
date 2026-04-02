import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcasCarrusel } from './marcas-carrusel';

describe('MarcasCarrusel', () => {
  let component: MarcasCarrusel;
  let fixture: ComponentFixture<MarcasCarrusel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcasCarrusel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcasCarrusel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
