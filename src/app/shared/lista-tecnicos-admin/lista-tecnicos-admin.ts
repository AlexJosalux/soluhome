import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-tecnicos-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-tecnicos-admin.html',
  styleUrl: './lista-tecnicos-admin.css',
})
// ASEGÚRATE DE QUE TENGA 'export class'
export class ListaTecnicosAdmin implements OnInit {
  public tecnicos: any[] = [];

  ngOnInit() {
    this.inicializarOSincronizar();
  }

  inicializarOSincronizar() {
    const storedUsers = localStorage.getItem('usuarios_db');
    
    if (storedUsers) {
      const todosLosUsuarios = JSON.parse(storedUsers);
      this.tecnicos = todosLosUsuarios.filter((u: any) => u.rol === 'tecnico');
      
      if (this.tecnicos.length === 0) {
        this.insertarTecnicosDefault(todosLosUsuarios);
      }
    } else {
      this.insertarTecnicosDefault([]);
    }
  }

  insertarTecnicosDefault(usuariosExistentes: any[]) {
    const nuevosTecnicos = [
      { id: 101, nombre: 'Carlos Ruiz', especialidad: 'Electricidad', disponible: true, rol: 'tecnico' },
      { id: 102, nombre: 'Juan Pérez', especialidad: 'Plomería', disponible: true, rol: 'tecnico' },
      { id: 103, nombre: 'Andrés Lumbi', especialidad: 'Pintura', disponible: true, rol: 'tecnico' },
      { id: 104, nombre: 'Mateo Viteri', especialidad: 'Aire Acondicionado', disponible: true, rol: 'tecnico' },
      { id: 105, nombre: 'Luis Tipán', especialidad: 'Línea Blanca', disponible: true, rol: 'tecnico' },
      { id: 106, nombre: 'Kevin Silva', especialidad: 'Albañilería', disponible: true, rol: 'tecnico' }
    ];

    const bdActualizada = [...usuariosExistentes, ...nuevosTecnicos];
    localStorage.setItem('usuarios_db', JSON.stringify(bdActualizada));
    this.tecnicos = nuevosTecnicos;
  }

  toggleEstado(id: number) {
    const storedUsers = JSON.parse(localStorage.getItem('usuarios_db') || '[]');
    const index = storedUsers.findIndex((u: any) => u.id === id);

    if (index !== -1) {
      storedUsers[index].disponible = !storedUsers[index].disponible;
      localStorage.setItem('usuarios_db', JSON.stringify(storedUsers));
      this.tecnicos = storedUsers.filter((u: any) => u.rol === 'tecnico');
    }
  }
}