import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrusel-comentarios',
  imports: [CommonModule],
  templateUrl: './carrusel-comentarios.html',
  styleUrl: './carrusel-comentarios.css',
})
export class CarruselComentarios implements OnInit, OnDestroy {
  activeIndex = 0;
  
  testimonios = [
    { texto: 'Excelente servicio en la instalación eléctrica de mi hogar. Muy profesionales.', nombre: 'Carlos Ruiz', servicio: 'Instalación Eléctrica' },
    { texto: 'El mantenimiento preventivo de mi aire acondicionado fue impecable. Recomendados.', nombre: 'Elena Mora', servicio: 'Climatización' },
    { texto: 'Atención rápida y diagnósticos precisos. La mejor solución técnica que he contratado.', nombre: 'Juan Pérez', servicio: 'Soporte Técnico' }
  ];

  next() {
    this.activeIndex = (this.activeIndex + 1) % this.testimonios.length;
  }

  prev() {
    this.activeIndex = (this.activeIndex - 1 + this.testimonios.length) % this.testimonios.length;
  }
  ngOnInit(): void {
    // Aquí puedes inicializar timers o servicios si lo necesitas
    console.log('Componente de testimonios listo');
  }

  // 2. ASEGÚRATE DE TENER TAMBIÉN EL ngOnDestroy SI LO DECLARASTE
  ngOnDestroy(): void {
    // Limpieza de suscripciones o intervalos
  }
}
