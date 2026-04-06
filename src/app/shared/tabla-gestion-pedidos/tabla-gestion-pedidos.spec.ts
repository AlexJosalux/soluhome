import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaGestionPedidos } from './tabla-gestion-pedidos';

describe('TablaGestionPedidos', () => {
  let component: TablaGestionPedidos;
  let fixture: ComponentFixture<TablaGestionPedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaGestionPedidos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaGestionPedidos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
