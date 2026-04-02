import { Component } from '@angular/core';

@Component({
  selector: 'app-beneficios',
  imports: [],
  templateUrl: './beneficios.html',
  styleUrl: './beneficios.css',
})
export class BeneficiosComponent {
  infoPrincipal = {
    titulo: '¿Por qué somos tu mejor opción?',
    descripcion: 'Nos especializamos en brindar soluciones técnicas de alta calidad con un enfoque en la seguridad y la durabilidad de tu hogar.'
  };

  listaBeneficios = [
    {
      id: 1,
      titulo: 'Técnicos Certificados',
      descripcion: 'Personal experto y calificado para cada tipo de instalación técnica.',
      iconPath: 'M9 12.75L11.25 15L15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.334 9-6.03 9-11.623 0-1.31-.21-2.57-.598-3.751A11.956 11.956 0 0112 2.714z'
    },
    {
      id: 2,
      titulo: 'Servicio Garantizado',
      descripcion: 'Todos nuestros trabajos cuentan con respaldo y soporte técnico post-venta.',
      iconPath: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.499z'
    },
    {
      id: 3,
      titulo: 'Atención Inmediata',
      descripcion: 'Coordinamos visitas técnicas ágiles para resolver tus problemas sin esperas.',
      iconPath: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];

}
