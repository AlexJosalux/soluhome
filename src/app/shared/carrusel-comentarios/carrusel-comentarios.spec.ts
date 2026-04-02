import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarruselComentarios } from './carrusel-comentarios';

describe('CarruselComentarios', () => {
  let component: CarruselComentarios;
  let fixture: ComponentFixture<CarruselComentarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarruselComentarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarruselComentarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
