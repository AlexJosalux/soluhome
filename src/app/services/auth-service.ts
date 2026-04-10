import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Importante: Usar HttpClient
import { Usuario } from '../models/usuario';
import { Observable, tap, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient); // Inyectamos HttpClient directamente
  
  // URL de tu API de Spring Boot
  private API_AUTH = 'http://localhost:8080/api/auth';

  public sesionIniciada = signal<boolean>(localStorage.getItem('sesion') === 'true');
  public rolActual = signal<string | null>(localStorage.getItem('rol'));
  public usuarioLogueado = signal<Usuario | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  );

  /**
   * Login conectando al Backend de Spring Boot
   */
  login(email: string, password: string): Observable<boolean> {
    // Enviamos solo las credenciales al controlador /api/auth/login
    return this.http.post<Usuario>(`${this.API_AUTH}/login`, { email, password }).pipe(
      tap(usuarioCoincide => {
        // Si el backend responde con éxito (200 OK)
        localStorage.setItem('sesion', 'true');
        localStorage.setItem('user', JSON.stringify(usuarioCoincide));
        localStorage.setItem('rol', usuarioCoincide.rol);

        this.rolActual.set(usuarioCoincide.rol);
        this.usuarioLogueado.set(usuarioCoincide);
        this.sesionIniciada.set(true);
      }),
      // Convertimos la respuesta en un booleano para tu componente
      map(() => true),
      // Si el backend devuelve 401 (Credenciales incorrectas)
      catchError(() => of(false))
    );
  }

  /**
   * Registro conectando al Backend (Para reemplazar Firebase)
   */
  register(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_AUTH}/register`, usuario);
  }

  logout(): void {
    localStorage.clear(); // Más rápido para limpiar todo
    this.sesionIniciada.set(false);
    this.rolActual.set(null);
    this.usuarioLogueado.set(null);
    this.router.navigate(['/login']);
  }

  estaAutenticado(): boolean { return this.sesionIniciada(); }
  obtenerRol(): string | null { return this.rolActual(); }
}