import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-procesos',
  imports: [CommonModule, RouterModule],
  templateUrl: './procesos.html',
  styleUrl: './procesos.css',
})
export class Procesos {

  pasosProtocolo = [
  {
    id: '01',
    titulo: 'Solicita tu Servicio',
    subtitulo: 'Mantenimiento e Instalación',
    descripcion: 'Agenda instalaciones eléctricas, mantenimiento de aires acondicionados o reparaciones técnicas con expertos certificados.',
    icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
    color: '#1e3a5f', // Azul Marino
    link: '/servicios'
  },
  {
    id: '02',
    titulo: 'Compra Equipos',
    subtitulo: 'Productos para el Hogar',
    descripcion: 'Adquiere tecnología de alta eficiencia: calefones, aires acondicionados y sistemas de iluminación con entrega inmediata.',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    color: '#f59e0b', // Ámbar
    link: '/productos'
  },
  {
    id: '03',
    titulo: 'Respaldo y Garantía',
    subtitulo: 'Tu Tranquilidad Primero',
    descripcion: 'Cada trabajo y producto cuenta con nuestro sello de garantía técnica y soporte especializado post-venta.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    color: '#1e3a5f',
    link: '/nosotros'
  }
];
}
