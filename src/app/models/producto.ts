export interface Producto {
  // Cambiamos string por number | string para que sea compatible 
  // con los IDs de MockAPI (strings) y los de tu nueva DB (numbers)
  id: any; 
  
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  
  // --- CAMPOS NECESARIOS PARA EL CARRITO Y LA DB ---
  tipo?: 'producto' | 'servicio'; // Para diferenciar en la tabla pedido_detalles
  cantidad?: number;              // Para cuando el usuario sume unidades
  createdAt?: string;             // Fecha de creación para auditoría
  updatedAt?: string;
  metodoPago?: string;
}