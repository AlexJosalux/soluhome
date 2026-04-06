import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTecnicosAdmin } from './lista-tecnicos-admin';

describe('ListaTecnicosAdmin', () => {
  let component: ListaTecnicosAdmin;
  let fixture: ComponentFixture<ListaTecnicosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaTecnicosAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaTecnicosAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
