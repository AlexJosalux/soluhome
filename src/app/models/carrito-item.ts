export interface CarritoItem {
  id: number;                // Mantenemos number para consistencia con la DB
  nombre: string;
  precio: number;
  cantidad: number;          // Importante para el total del presupuesto
  imagenUrl?: string;        // Cambiado de 'imagen' a 'imagenUrl' para coincidir con Producto

  // Discriminador de comportamiento (En mayúsculas por estándar de DB)
  tipo: 'PRODUCTO' | 'SERVICIO'; 

  // Específicos de Producto
  sku?: string;                
  
  // Específicos de Servicio
  categoria?: string;          
  fechaAgenda?: string;        // ISO String para la cita técnica
  tecnicoId?: number | null;   // Especialista asignado

}