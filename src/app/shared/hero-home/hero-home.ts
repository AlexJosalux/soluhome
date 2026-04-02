import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// Definimos la estructura de un Banner
interface Banner {
  id: number;
  imagenUrl: string;
  titulo: string;
  tituloResaltado: string;
  descripcion: string;
}

@Component({
  selector: 'app-hero-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-home.html',
  styleUrl: './hero-home.css'
})
export class HeroHome implements OnInit {
  
  // 1. Datos de tus banners (Imágenes de SoluHome)
  banners = signal<Banner[]>([
    {
      id: 1,
      imagenUrl: 'https://i.postimg.cc/qq6gvJRs/hero.png', // La imagen original
      titulo: 'Mantenimiento y',
      tituloResaltado: 'Productos Garantizados',
      descripcion: 'Excelencia técnica en mantenimiento y productos exclusivos para el hogar. Calidad respaldada por expertos y tecnología de vanguardia.'
    },
    {
      id: 2,
      imagenUrl: 'https://i.postimg.cc/3xv6CPyy/hero2.png', // Electricidad/Hogar
      titulo: 'Soluciones Integrales en',
      tituloResaltado: 'Electricidad y Climatización',
      descripcion: 'Instalaciones seguras y eficientes para tu tranquilidad. Soluciones a medida para cada hogar.'
    },
    {
      id: 3,
      imagenUrl: 'https://i.postimg.cc/HkNMHhBg/hero3.png', // Herramientas/Hogar
      titulo: 'Herramientas y',
      tituloResaltado: 'Equipos Profesionales',
      descripcion: 'Descubre nuestra línea exclusiva para el mantenimiento y mejora de tu hogar.'
    }
  ]);

  // 2. Signal para controlar el índice actual
  indiceActivo = signal(0);

  // 3. Signal computada para obtener el banner actual
  bannerActual = computed(() => this.banners()[this.indiceActivo()]);

  ngOnInit(): void {
    this.iniciarAutoplay();
  }

  // 4. Lógica del Autoplay
  iniciarAutoplay() {
    setInterval(() => {
      this.siguienteSlide();
    }, 6000); // Cambia cada 6 segundos
  }

  // 5. Método para navegación automática
  siguienteSlide() {
    this.indiceActivo.update(idx => (idx + 1) % this.banners().length);
  }

  // 6. Método para navegación manual (por los puntitos)
  irASlide(index: number) {
    this.indiceActivo.set(index);
  }
}