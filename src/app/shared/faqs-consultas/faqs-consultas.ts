import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faqs-consultas',
  imports: [CommonModule],
  templateUrl: './faqs-consultas.html',
  styleUrl: './faqs-consultas.css',
})
export class FaqsConsultas {
faqActiva: number | null = null;

  // Se agregaron 2 FAQs más relacionadas a SoluHome
  preguntasFrecuentes = [
    { id: 1, p: '¿Cómo solicito la garantía?', r: 'Solo necesitas tu factura de compra o el código digital enviado tras la visita técnica.' },
    { id: 2, p: '¿Tienen cobertura en Valles?', r: 'Cubrimos todo Quito, Cumbayá, Tumbaco y el Valle de los Chillos sin recargos adicionales.' },
    { id: 3, p: '¿Qué incluye la inspección?', r: 'Un diagnóstico visual para identificar la falla. No incluye reparaciones ni piezas de repuesto.' },
    { id: 4, p: '¿Métodos de pago?', r: 'Efectivo, transferencia y todas las tarjetas de crédito mediante link de pago seguro.' },
    { id: 5, p: '¿Realizan mantenimientos preventivos?', r: 'Sí, diseñamos planes anuales para sistemas eléctricos y de climatización para evitar fallos costosos.' },
    { id: 6, p: '¿Los técnicos son certificados?', r: 'Todo nuestro personal cuenta con certificación técnica y sigue protocolos de seguridad industrial.' }
  ];

  toggleFaq(id: number) {
    this.faqActiva = this.faqActiva === id ? null : id;
  }

}
