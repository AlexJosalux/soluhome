import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoDetalle } from './carrito-detalle';

describe('CarritoDetalle', () => {
  let component: CarritoDetalle;
  let fixture: ComponentFixture<CarritoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
