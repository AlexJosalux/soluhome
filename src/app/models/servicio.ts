export interface Servicio {
  id: string;
  titulo: string;
  imagen: string;
  precioBase: number;
  precioPost: number;
  fechaServicio: string;
  categoria: string;
  incluye: string[];
  estado: 'Disponible' | 'Urgente' | 'Agotado';
}