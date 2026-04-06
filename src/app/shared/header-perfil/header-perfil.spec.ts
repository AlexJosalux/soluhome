import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPerfil } from './header-perfil';

describe('HeaderPerfil', () => {
  let component: HeaderPerfil;
  let fixture: ComponentFixture<HeaderPerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPerfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderPerfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
