import { Component } from '@angular/core';
import { FaqsConsultas } from '../../shared/faqs-consultas/faqs-consultas';

@Component({
  selector: 'app-consultas-page',
  imports: [FaqsConsultas],
  templateUrl: './consultas-page.html',
  styleUrl: './consultas-page.css',
})
export class ConsultasPage {
}
