import { TestBed } from '@angular/core/testing';

import { DataServicios } from './data-servicios';

describe('DataServicios', () => {
  let service: DataServicios;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataServicios);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
