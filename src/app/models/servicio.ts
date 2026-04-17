export interface Servicio {
  id?: number;
  sku: string;           // Identificador único (ej: SERV-ELEC-01)
  nombre: string;
  descripcion: string;
  
  // Lógica de Precios
  precioBase: number;    // Lo que se cobra por la visita o diagnóstico inicial
  precioPost?: number;   // El valor final ajustado tras la revisión del técnico
  
  categoria: string;     // Para vincular con la especialidad del técnico
  imagenUrl?: string;
  
  // Gestión de Tiempo
  fechaServicio?: string; // Fecha y hora programada para la atención
  
  tipo: 'servicio';      // Discriminador para el comportamiento del carrito
}