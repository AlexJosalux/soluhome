import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Usuarios } from '../models/usuario'; // Usando tu modelo singular
import { ApiResponse } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly API_URL = 'http://localhost:8080/api/usuarios';
  private http = inject(HttpClient);

  // Signal para el usuario que tiene la sesión activa actualmente
  usuarioAutenticado = signal<Usuarios | null>(
    JSON.parse(localStorage.getItem('soluhome_user') || 'null')
  );

  /**
   * Obtener todos los usuarios (Solo para ADMIN)
   */
  getUsuarios(): Observable<ApiResponse<Usuarios[]>> {
    return this.http.get<ApiResponse<Usuarios[]>>(this.API_URL).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener lista de Técnicos (Útil para asignar a servicios de SoluHome)
   */
  getTecnicos(): Observable<ApiResponse<Usuarios[]>> {
    return this.http.get<ApiResponse<Usuarios[]>>(`${this.API_URL}/rol/TECNICO`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener perfil detallado por ID
   */
  getUsuarioPorId(id: number): Observable<ApiResponse<Usuarios>> {
    return this.http.get<ApiResponse<Usuarios>>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar datos del perfil (Dirección, teléfono, etc.)
   */
  actualizarPerfil(id: number, datos: Partial<Usuarios>): Observable<ApiResponse<Usuarios>> {
    return this.http.put<ApiResponse<Usuarios>>(`${this.API_URL}/${id}`, datos).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar cuenta de usuario
   */
  eliminarUsuario(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores adaptado
   */
  private handleError(error: HttpErrorResponse) {
    let mensaje = 'Error al gestionar usuarios';
    if (error.error?.message) {
      mensaje = error.error.message;
    } else if (error.status === 403) {
      mensaje = 'No tienes permisos para realizar esta acción';
    }
    return throwError(() => new Error(mensaje));
  }
}
