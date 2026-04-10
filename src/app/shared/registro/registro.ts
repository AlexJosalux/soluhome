import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario-service';
import { AuthService } from '../../services/auth-service'; // Asegura la ruta correcta a tu servicio
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private readonly usuarioService = inject(UsuarioService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Estado de carga para el feedback visual en el botón
  public cargando = signal<boolean>(false);

  /**
   * Objeto vinculado al formulario.
   * Se inicializa con ROLE_CLIENTE para coincidir con la seguridad de Spring Boot.
   */
  public nuevoUsuario: Usuario = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'ROLE_CLIENTE' as any // Ajustado para consistencia con la DB
  };

  /**
   * Método para establecer el rol visualmente desde el asistente.
   * @param rol Debe coincidir con los GrantedAuthorities de Java.
   */
  public setRol(rol: 'cliente' | 'tecnico' | 'admin') {
    this.nuevoUsuario.rol = rol as any;
  }

  /**
   * Envía los datos a la API de Spring Boot para persistencia en PostgreSQL.
   */
  registrar() {
    // 1. Validación básica de campos obligatorios
    if (!this.nuevoUsuario.email || !this.nuevoUsuario.password || !this.nuevoUsuario.nombre || !this.nuevoUsuario.apellido) {
      alert('Por favor, completa todos los campos para crear tu perfil SoluHome.');
      return;
    }

    // 2. Feedback visual
    this.cargando.set(true);

    // 3. Petición HTTP al Backend
    this.usuarioService.postUsuario(this.nuevoUsuario).subscribe({
      next: (res) => {
        this.cargando.set(false);
        
        // 4. Confirmación al usuario
        alert('¡Cuenta de SoluHome creada con éxito! Por favor, inicia sesión para continuar.');
        
        // 5. Redirección al Login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro de SoluHome:', err);
        alert('Hubo un error al conectar con el servidor. Revisa que el Backend esté activo.');
        this.cargando.set(false);
      }
    });
  }
}