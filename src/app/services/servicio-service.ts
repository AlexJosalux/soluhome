import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { Servicio } from '../models/servicio';
import { ApiResponse } from './auth-service'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  private readonly API_URL = 'http://localhost:8080/api/servicios';
  private http = inject(HttpClient);

  // Signal que actúa como fuente de verdad para el catálogo de servicios en la UI
  public servicios = signal<Servicio[]>([]);

  /**
   * Obtener catálogo completo de servicios técnicos
   * @param categoria Filtro opcional por categoría
   */
  getServicios(categoria?: string): Observable<ApiResponse<Servicio[]>> {
    let params = new HttpParams();
    if (categoria) params = params.set('categoria', categoria);

    // Concatenamos /listar para obtener la colección
    return this.http.get<ApiResponse<Servicio[]>>(`${this.API_URL}/listar`, { params }).pipe(
      tap(res => {
        if (res.success && res.data) {
          // Actualizamos el signal para que la UI de SoluHome se refresque automáticamente
          this.servicios.set(res.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener un servicio específico por su ID
   */
  getServicioPorId(id: number): Observable<ApiResponse<Servicio>> {
    // Nota: Si en Java no creaste un endpoint /{id}, esto dará 404
    return this.http.get<ApiResponse<Servicio>>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear nuevo tipo de servicio (Ruta: /api/servicios/guardar)
   */
  crearServicio(servicio: Servicio): Observable<ApiResponse<Servicio>> {
    return this.http.post<ApiResponse<Servicio>>(`${this.API_URL}/guardar`, servicio).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar datos de un servicio (Ruta: /api/servicios/actualizar/{id})
   */
  actualizarServicio(id: number, servicio: Partial<Servicio>): Observable<ApiResponse<Servicio>> {
    return this.http.put<ApiResponse<Servicio>>(`${this.API_URL}/actualizar/${id}`, servicio).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar un servicio del catálogo (Ruta: /api/servicios/eliminar/{id})
   */
  eliminarServicio(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/eliminar/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Buscar técnicos disponibles para un servicio (Ruta personalizada)
   */
  getTecnicosDisponibles(servicioId: number, fecha: string): Observable<ApiResponse<any[]>> {
    const params = new HttpParams()
      .set('servicioId', servicioId.toString())
      .set('fecha', fecha);

    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/tecnicos-disponibles`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejador de errores centralizado
   */
  private handleError(error: HttpErrorResponse) {
    let mensaje = 'Error al procesar los servicios técnicos en SoluHome';
    
    if (error.error?.message) {
      mensaje = error.error.message;
    } else {
      switch (error.status) {
        case 400:
          mensaje = 'Solicitud incorrecta. Verifica los datos enviados.';
          break;
        case 403:
          mensaje = 'No tienes permiso para acceder a este recurso (403 Forbidden).';
          break;
        case 404:
          mensaje = 'El servicio o ruta no existe en el servidor (404 Not Found).';
          break;
        case 500:
          mensaje = 'Error interno en el servidor de Spring Boot.';
          break;
      }
    }
    
    console.error(`Status: ${error.status}, Body:`, error.error);
    return throwError(() => new Error(mensaje));
  }
}