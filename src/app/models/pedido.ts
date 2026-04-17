import { CarritoItem } from "./carrito-item";

export interface Pedido {
  id?: number;
  // Cambiamos detalles para que sea más descriptivo como en tu backend
  detalles: { 
    itemId: string;      // ID del producto o servicio
    nombreItem: string;  // Nombre para mostrar en la factura
    precioUnitario: number; 
    cantidad: number 
  }[];
  
  // Datos del Cliente
  usuarioId?: number;
  usuarioNombre?: string;
  usuarioEmail?: string;
  direccionEnvio?: string; // Opcional si es solo servicio en sitio

  // Datos del Técnico y Agenda (Lo nuevo para SoluHome)
  tecnicoId?: number | null;
  tecnicoNombre?: string; 
  fechaAgenda?: string;    // La fecha y hora que seleccionó el usuario
  
  // Valores Financieros
  subtotal: number;
  iva: number;
  total: number;
  metodoPago?: string;

  // Control de Estado
  // Usamos EN_PROCESO para servicios agendados
  estado?: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'ANULADO';
  fecha?: string; // Fecha de creación del registro
}

export interface PedidoResponse extends Pedido {
  // Al usar 'extends', heredamos todo lo de Pedido y nos aseguramos 
  // de que el ID y campos obligatorios vengan del Backend
  id: number;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'ANULADO';
  fecha: string;
}