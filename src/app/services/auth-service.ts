import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuarios } from '../models/usuario'; 

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private http = inject(HttpClient);

  // --- SIGNALS ---
  public sesionIniciada = signal<boolean>(localStorage.getItem('soluhome_sesion') === 'true');

  public usuarioLogueado = signal<Usuarios | null>(
    localStorage.getItem('soluhome_user') ? JSON.parse(localStorage.getItem('soluhome_user')!) : null
  );

  public rolActual = computed(() => this.usuarioLogueado()?.rol || null);

  /**
   * LOGIN: Autenticación con Spring Boot
   */
  login(email: string, password: string): Observable<ApiResponse<Usuarios>> {
    return this.http.post<ApiResponse<Usuarios>>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(res => {
          if (res.success && res.data) {
            this.guardarSesion(res.data);
          }
        })
      );
  }

  /**
   * REGISTER: Creación de nuevos usuarios (NUEVO MÉTODO)
   * Recibe un objeto parcial de Usuarios y devuelve la respuesta del servidor
   */
  register(datos: Partial<Usuarios>): Observable<ApiResponse<Usuarios>> {
    return this.http.post<ApiResponse<Usuarios>>(`${this.API_URL}/register`, datos);
  }

  /**
   * Persistencia y actualización de Signals
   */
  guardarSesion(usuario: Usuarios): void {
    localStorage.setItem('soluhome_sesion', 'true');
    localStorage.setItem('soluhome_user', JSON.stringify(usuario));
    
    this.usuarioLogueado.set(usuario);
    this.sesionIniciada.set(true);
  }

  /**
   * LOGOUT: Limpieza total
   */
  logout(): void {
    localStorage.clear();
    this.usuarioLogueado.set(null);
    this.sesionIniciada.set(false);
  }

  // Helpers de rol para lógica rápida
  esAdmin(): boolean { return this.rolActual() === 'ROLE_ADMIN'; }
  esTecnico(): boolean { return this.rolActual() === 'ROLE_TECNICO'; }
}