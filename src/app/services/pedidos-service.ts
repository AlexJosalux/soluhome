import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Pedido } from '../models/pedido'; 
import { ApiResponse } from './auth-service'; // Importamos la interfaz genérica

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  // Ajustamos la ruta al estándar de tu API en Spring Boot
  private readonly API_URL = 'http://localhost:8080/api/pedidos/guardar';
  private http = inject(HttpClient);

  // Signal para mantener la lista de pedidos actualizada en la UI
  pedidos = signal<Pedido[]>([]);

  /**
   * Obtiene todos los pedidos (útil para el Administrador)
   */
  getPedidos(): Observable<ApiResponse<Pedido[]>> {
    return this.http.get<ApiResponse<Pedido[]>>(this.API_URL).pipe(
      map(res => {
        if (res.success) this.pedidos.set(res.data);
        return res;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene los pedidos de un cliente específico (Historial)
   */
  getMisPedidos(usuarioId: number): Observable<ApiResponse<Pedido[]>> {
    return this.http.get<ApiResponse<Pedido[]>>(`${this.API_URL}/usuario/${usuarioId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * CREAR PEDIDO: Aquí enviamos el objeto híbrido de SoluHome
   */
  crearPedido(pedido: any): Observable<ApiResponse<Pedido>> {
    return this.http.post<ApiResponse<Pedido>>(this.API_URL, pedido).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar estado (Ej: de PENDIENTE a COMPLETADO cuando el técnico termina)
   */
  actualizarEstado(id: number, nuevoEstado: string): Observable<ApiResponse<Pedido>> {
    return this.http.patch<ApiResponse<Pedido>>(`${this.API_URL}/${id}/estado`, { estado: nuevoEstado }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores profesional
   */
  private handleError(error: HttpErrorResponse) {
    let mensaje = 'Ocurrió un error en la plataforma';
    if (error.error?.message) {
      mensaje = error.error.message;
    }
    return throwError(() => new Error(mensaje));
  }
}