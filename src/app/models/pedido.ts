export interface Pedido {
  id: string;
  clienteId: string;
  items: any[]; 
  total: number;
  fecha: string;
  // CAMPO CLAVE
  tipo: 'SOLO_PRODUCTO' | 'SERVICIO_TECNICO'; 
  estado: 'PAGADO' | 'PENDIENTE_ASIGNACION' | 'EN_PROCESO' | 'COMPLETADO';
  tecnicoId?: string;
}