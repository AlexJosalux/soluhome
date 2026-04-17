export interface Usuarios {
  id?: number;
  nombreCompleto: string;
  password: string;
  email: string;
  telefono?: string;
  direccion?: string;
  rol: 'ROLE_ADMIN' | 'ROLE_CLIENTE' | 'ROLE_TECNICO';
  especialidad?: string;
}