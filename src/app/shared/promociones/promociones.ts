import { Component } from '@angular/core';
import { Promocion } from '../../models/promocion';

@Component({
  selector: 'app-promociones',
  imports: [],
  templateUrl: './promociones.html',
  styleUrl: './promociones.css',
})
export class Promociones {
  
promociones: Promocion[] = [
    {
      id: 1,
      titulo: 'Cámaras de Seguridad IP',
      valor: '15',
      descripcion: 'Vigilancia 24/7 con acceso remoto desde tu móvil. Kit de 4 cámaras con instalación profesional incluida.',
      imagen: 'https://i.postimg.cc/XNkxdjXm/kit-de-4-camaras-de-seguridad-4k-8mpx-ip-poe-exterior-nvr-4ch-poe-9ch-audio-deteccion-humana-disco-1.png',
      iconPath: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
    },
    {
      id: 2,
      titulo: 'Cerraduras Digitales',
      valor: '10',
      descripcion: 'Sustituye tus llaves por huella dactilar o código. Compatible con puertas de madera y metal.',
      imagen: 'https://i.postimg.cc/63TdrJQg/R17003-01-450x450.png',
      iconPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
    },
    {
      id: 3,
      titulo: 'Alarmas Inteligentes',
      valor: '20', 
      descripcion: 'Sensores de movimiento y apertura vinculados a tu smartphone. Alerta inmediata ante cualquier intrusión.',
      imagen: 'https://i.postimg.cc/Wp54RFXC/alarmadd-(2).png',
      iconPath: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
    },
    {
      id: 4,
      titulo: 'Mantenimiento Eléctrico',
      valor: '25',
      descripcion: 'Revisión técnica de tableros, cableado y fugas eléctricas. Seguridad total para tu familia.',
      imagen: 'https://i.postimg.cc/Z5KgGns1/mantenimientoelectrico.png',
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z'
    }
  ];

}
