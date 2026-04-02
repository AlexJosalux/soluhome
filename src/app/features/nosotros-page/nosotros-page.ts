import { Component } from '@angular/core';
import { HeroNosotros } from '../../shared/hero-nosotros/hero-nosotros';
import { QuienesSomos } from '../../shared/quienes-somos/quienes-somos';
import { MisionVision } from '../../shared/mision-vision/mision-vision';
import { CarruselComentarios } from '../../shared/carrusel-comentarios/carrusel-comentarios';


@Component({
  selector: 'app-nosotros-page',
  imports: [HeroNosotros,QuienesSomos, MisionVision, CarruselComentarios],
  templateUrl: './nosotros-page.html',
  styleUrl: './nosotros-page.css',
})
export class NosotrosPage {

}
