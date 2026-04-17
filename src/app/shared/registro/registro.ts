import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Usuarios } from '../../models/usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink], 
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public cargando = signal<boolean>(false);
  public errorMessage = signal<string>('');

  public nuevoUsuario: Usuarios = {
    nombreCompleto: '',
    email: '',
    password: '', // Este es el que usa el HTML
    telefono: '',
    direccion: '',
    rol: 'ROLE_CLIENTE',
    especialidad: ''
  };

  setRol(rol: 'ROLE_CLIENTE' | 'ROLE_TECNICO') {
    this.nuevoUsuario.rol = rol;
  }

  registrar() {
    this.errorMessage.set('');
    
    // LOGS DE DEPURACIÓN
    console.log('--- Datos capturados ---');
    console.log('Nombre:', this.nuevoUsuario.nombreCompleto);
    console.log('Email:', this.nuevoUsuario.email);
    console.log('Pass:', this.nuevoUsuario.password);

    // VALIDACIÓN: Verificamos que nada esté vacío o sean solo espacios
    if (!this.nuevoUsuario.nombreCompleto?.trim() || 
        !this.nuevoUsuario.email?.trim() || 
        !this.nuevoUsuario.password?.trim()) {
      this.errorMessage.set('Por favor, completa los campos obligatorios.');
      console.warn('Validación fallida: existen campos vacíos en el objeto');
      return;
    }

    this.cargando.set(true);

    this.authService.register(this.nuevoUsuario).subscribe({
      next: (res) => {
        this.cargando.set(false);
        if (res.success) {
          alert('¡Cuenta de SoluHome creada con éxito!');
          this.router.navigate(['/login']);
        } else {
          this.errorMessage.set(res.message || 'Error al crear la cuenta.');
        }
      },
      error: (err) => {
        this.cargando.set(false);
        // Si el backend responde (ej. correo ya existe), mostramos ese mensaje
        const msg = err.error?.message || 'Error de conexión con el servidor.';
        this.errorMessage.set(msg);
        console.error('Error en registro:', err);
      }
    });
  }
}