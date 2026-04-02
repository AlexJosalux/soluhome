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
  styleUrl: './registro.css'
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
    rol: 'cliente' 
  };

  /**
   * Método para registrar al usuario en Firebase y redirigir al Login
   */
  registrar() {
    // 1. Validación básica de campos obligatorios
    if (!this.nuevoUsuario.email || !this.nuevoUsuario.password || !this.nuevoUsuario.nombre) {
      alert('Por favor, completa todos los campos con borde azul.');
      return;
    }

    // 2. Activamos el estado de carga
    this.cargando.set(true);

    // 3. Enviamos los datos a la base de datos a través del servicio
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