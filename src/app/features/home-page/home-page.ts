import { Component } from '@angular/core';
import { HeroHome } from '../../shared/hero-home/hero-home';
import { Servicios } from "../../shared/servicios/servicios";
import { Procesos } from "../../shared/procesos/procesos";
import { BeneficiosComponent } from "../../shared/beneficios/beneficios";
import { MarcasCarrusel } from "../../shared/marcas-carrusel/marcas-carrusel";
import { Promociones } from "../../shared/promociones/promociones";

@Component({
  selector: 'app-home-page',
  imports: [HeroHome, Servicios, Procesos, BeneficiosComponent, MarcasCarrusel, Promociones],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

}
