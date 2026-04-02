export interface Banner {
  id: number;
  imagenUrl: string;
  titulo: string;
  descripcion: string;
  textoBoton: string;
  rutaBoton: string; // Ej: '/servicios' o '/productos'
}