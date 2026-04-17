import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { CarritoService } from '../services/carrito-service';

export const candeactivateGuard: CanDeactivateFn<unknown> = () => {
  const carritoService = inject(CarritoService);

  // Si el carrito tiene productos, preguntamos antes de dejar salir al usuario
  if (carritoService.items().length > 0) {
    return confirm('Tienes productos en el carrito. ¿Estás seguro de que quieres abandonar la página?');
  }

  // Si está vacío, permitimos la navegación
  return true;
};