import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError, tap } from 'rxjs';
import { Producto } from '../models/producto';
import { ApiResponse } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private readonly API_URL = 'http://localhost:8080/api/productos/listar';
  private http = inject(HttpClient);

  // Signal que alimentará a tu componente Productoshome
  productos = signal<Producto[]>([]);
  
  /**
   * Obtener productos y actualizar el signal global
   */
  getProductos(nombre?: string, categoria?: string): Observable<ApiResponse<Producto[]>> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    if (categoria) params = params.set('categoria', categoria);

    return this.http.get<ApiResponse<Producto[]>>(this.API_URL, { params }).pipe(
      // Tap es mejor para efectos secundarios como actualizar el signal
      tap(res => {
        if (res.success && res.data) {
          this.productos.set(res.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Buscar por SKU (Crucial para que los técnicos encuentren repuestos)
   */
  getProductoPorSku(sku: string): Observable<ApiResponse<Producto>> {
    return this.http.get<ApiResponse<Producto>>(`${this.API_URL}/sku/${sku}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear, Actualizar y Eliminar (Lógica de Administración)
   */
  crearProducto(producto: Producto): Observable<ApiResponse<Producto>> {
    return this.http.post<ApiResponse<Producto>>(this.API_URL, producto).pipe(
      catchError(this.handleError)
    );
  }

  actualizarProducto(id: number, producto: Partial<Producto>): Observable<ApiResponse<Producto>> {
    return this.http.put<ApiResponse<Producto>>(`${this.API_URL}/${id}`, producto).pipe(
      catchError(this.handleError)
    );
  }

  eliminarProducto(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let mensaje = 'Error en el catálogo de SoluHome';
    if (error.error?.message) {
      mensaje = error.error.message;
    } else if (error.status === 404) {
      mensaje = 'Producto no encontrado en el inventario';
    }
    return throwError(() => new Error(mensaje));
  }
}