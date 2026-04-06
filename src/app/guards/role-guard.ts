import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// En role-guard.ts
export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // CORRECCIÓN: AuthService usa 'user', así que buscamos esa clave primero
  const session = localStorage.getItem('user'); 

  if (!session) {
    return router.createUrlTree(['/login']);
  }

  const usuario = JSON.parse(session);
  const rolesPermitidos = route.data['roles'] as Array<string>;

  // IMPORTANTE: Asegúrate de que el campo sea 'rol' (con o) como en tu AuthService
  const userRol = usuario.rol?.toLowerCase().trim();

  const tienePermiso = rolesPermitidos.some(rol => rol.toLowerCase().trim() === userRol);

  if (tienePermiso) {
    return true; 
  }

  // Si no tiene permiso, te manda aquí (por eso terminabas en /usuario)
  return router.createUrlTree(['/usuario']); 
};