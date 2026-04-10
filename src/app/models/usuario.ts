export interface Usuario {
  id?: string;
  uid?: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'cliente' | 'admin' | 'tecnico';
  especialidad?: string; // <--- AGREGA ESTA LÍNEA
  disponible?: boolean;
  password?: string; 
  
  pedidos?: any[]; // Aquí vendrán los datos de la base de datos
}