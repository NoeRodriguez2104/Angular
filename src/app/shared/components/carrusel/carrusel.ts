import { ArtistCardComponent } from './../artist-card/artist-card';
import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackCardComponent } from '../track-card/track-card';
import { AlbumComponent } from '../album/album';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule, TrackCardComponent, AlbumComponent, ArtistCardComponent],
  templateUrl: './carrusel.html',
  styleUrl: './carrusel.css',
})
export class CarruselComponent {
  // Input requerido: recibe una lista de items (pueden ser tracks, albums o artists)
  items = input.required<any[]>();

  // Input requerido: especifica el tipo de item ('track' | 'album' | 'artist')
  // Esto determina qué componente renderizar para cada item
  type = input.required<'track' | 'album' | 'artist'>();

  // Número de items a mostrar en cada "página" o vista del carrusel
  itemsPerView = 5;

  // Señal que mantiene la página actual del carrusel (comienza en 0)
  page = signal(0);

  // Computed que calcula el número total de páginas basado en items y itemsPerView
  totalPages = computed(() => Math.ceil(this.items().length / this.itemsPerView));

  // Computed que retorna solo los items visibles en la página actual
  // Utiliza slice() para extraer los items desde start hasta start + itemsPerView
  visibleItems = computed(() => {
    const start = this.page() * this.itemsPerView;
    return this.items().slice(start, start + this.itemsPerView);
  });

  // Método para avanzar a la siguiente página (si no estamos en la última)
  next() {
    if (this.page() < this.totalPages() - 1) this.page.update((p) => p + 1);
  }

  // Método para retroceder a la página anterior (si no estamos en la primera)
  prev() {
    if (this.page() > 0) this.page.update((p) => p - 1);
  }
}
