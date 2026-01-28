import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../../core/services/music-service';
import { CarruselComponent } from '../carrusel/carrusel';

@Component({
  selector: 'app-artist-list',
  standalone: true,
  imports: [CommonModule, CarruselComponent],
  templateUrl: './artist-list.html',
})
export class ArtistListComponent implements OnInit {
  // Inyectamos el servicio de música para acceder a los datos de artistas
  music = inject(MusicService);

  // Accedemos a la señal de artistas del servicio (contiene los artistas con sus imágenes)
  artists = this.music.artists;

  // Término de búsqueda amplio para obtener muchos resultados de artistas populares
  query = 'a';

  // Al inicializar el componente, buscamos los artistas
  ngOnInit() {
    // Llamamos a searchArtists que internamente obtiene las imágenes de cada artista
    this.music.searchArtists(this.query);
  }
}
