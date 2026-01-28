import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artist } from '../../../core/services/music-service';
import { FavoritoBtnComponent } from '../favorito-btn/favorito-btn';

@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [CommonModule, FavoritoBtnComponent],
  templateUrl: './artist-card.html',
  styleUrl: './artist-card.css',
})
export class ArtistCardComponent {
  // Recibimos el objeto artista como input requerido (señal moderna de Angular)
  // Este objeto contiene: artistId, artistName, primaryGenreName e image
  artist = input.required<Artist>();
}
