import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from './usuario-service';
import { Usuario } from '../models/usuario'; // Asegúrate de importar tu interfaz
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private servicioUsuario = inject(UsuarioService);

  // Signals reactivos para el estado global de la app
  public sesionIniciada = signal<boolean>(localStorage.getItem('sesion') === 'true');
  public rolActual = signal<string | null>(localStorage.getItem('rol'));
  
  // Nuevo Signal para obtener el objeto usuario completo fácilmente
  public usuarioLogueado = signal<Usuario | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  );

  /**
   * Intenta iniciar sesión comparando credenciales con la lista de usuarios.
   */
  login(email: string, password: string): Observable<boolean> {
    return this.servicioUsuario.getUsuarios().pipe(
      map(usuarios => {
        const usuarioCoincide = usuarios.find(u => u.email === email && u.password === password);

        if (usuarioCoincide) {
          // Guardar estado en LocalStorage
          localStorage.setItem('sesion', 'true');
          localStorage.setItem('user', JSON.stringify(usuarioCoincide));
          localStorage.setItem('rol', usuarioCoincide.rol);

          // Actualizar Signals reactivos
          this.rolActual.set(usuarioCoincide.rol);
          this.usuarioLogueado.set(usuarioCoincide);
          this.sesionIniciada.set(true);
          
          return true;
        }
        return false;
      })
    );
  }

  /**
   * Método para obtener el usuario actual desde cualquier componente
   */
  getUsuarioActual(): Usuario | null {
    return this.usuarioLogueado();
  }

  /**
   * Limpia la sesión y redirige al inicio
   */
  logout(): void {
    // Limpiar almacenamiento
    localStorage.removeItem('sesion');
    localStorage.removeItem('user');
    localStorage.removeItem('rol');

    // Resetear Signals
    this.sesionIniciada.set(false);
    this.rolActual.set(null);
    this.usuarioLogueado.set(null);

    // Redirección nítida al login
    this.router.navigate(['/login']);

  }
  estaAutenticado(): boolean {
  return this.sesionIniciada();
}

/**
 * Retorna el rol para proteger vistas administrativas
 */
obtenerRol(): string | null {
  return this.rolActual();
}
}