import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Importamos RouterModule para el routerLink del HTML
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario-service';
import { AuthService } from '../../services/auth-service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], // Agregamos RouterModule aquí
  templateUrl: './registro.html',
  // styleUrls: ['./registro.css'] // Eliminamos la referencia a CSS si estamos usando Tailwind
})
export class Registro {
  private readonly usuarioService = inject(UsuarioService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Estado de carga para el feedback visual en el botón
  public cargando = signal<boolean>(false);

  // Objeto vinculado al formulario mediante [(ngModel)]
  public nuevoUsuario: Usuario = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'cliente' // Valor por defecto
  };

  /**
   * Método para establecer el rol visualmente desde el asistente
   */
  public setRol(rol: 'cliente' | 'tecnico') {
    this.nuevoUsuario.rol = rol;
  }

  /**
   * Método para registrar al usuario en la base de datos de itelligent
   */
  registrar() {
    // 1. Validación básica de campos obligatorios
    if (!this.nuevoUsuario.email || !this.nuevoUsuario.password || !this.nuevoUsuario.nombre || !this.nuevoUsuario.apellido) {
      alert('Por favor, completa todos los campos para crear tu perfil SoluHome.');
      return;
    }

    // 2. Activamos el estado de carga
    this.cargando.set(true);

    // 3. Enviamos los datos a la base de datos de PostgreSQL a través del servicio
    this.usuarioService.postUsuario(this.nuevoUsuario).subscribe({
      next: (res) => {
        // Detenemos el estado de carga
        this.cargando.set(false);
        
        // 4. Mostramos la alerta de confirmación
        alert('¡Cuenta de SoluHome creada con éxito! Por favor, inicia sesión para continuar.');
        
        // 5. Redirección al componente de Login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro de SoluHome:', err);
        alert('Hubo un error al conectar con el servidor. Inténtalo de nuevo.');
        this.cargando.set(false);
      }
    });
  }
}