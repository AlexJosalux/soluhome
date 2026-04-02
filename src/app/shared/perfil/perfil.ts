import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {
  // Recibimos los datos desde el componente "Usuarios" (Feature)
  @Input() data: Usuario | null = null;
  
  // Emitimos un evento cuando se haga clic en cerrar sesión
  @Output() logoutEvent = new EventEmitter<void>();

  // Lógica interna para colores de bordes nítidos según el rol
  get borderColor() {
    if (this.data?.rol === 'admin') return 'border-slate-900';
    if (this.data?.rol === 'tecnico') return 'border-amber-500';
    return 'border-blue-600';
  }

  cerrarSesion() {
    this.logoutEvent.emit();
  }
}
