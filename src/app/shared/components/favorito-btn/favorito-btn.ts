import { Component, Input, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritosService, FavoritoItem } from '../../../core/services/favoritos-service';

@Component({
  selector: 'app-favorito-btn',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleFavorito()"
      class="btn-favorito"
      [class.activo]="isFavorite()"
      [title]="isFavorite() ? 'Eliminar de favoritos' : 'Añadir a favoritos'"
      type="button"
    >
      <span class="icono">{{ isFavorite() ? '❤️' : '🤍' }}</span>
    </button>
  `,
  styles: [
    `
      .btn-favorito {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        padding: 0.5rem;
        transition: transform 0.2s ease;
      }

      .btn-favorito:hover {
        transform: scale(1.2);
      }

      .btn-favorito.activo .icono {
        animation: pulse 0.3s ease;
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.3);
        }
        100% {
          transform: scale(1);
        }
      }
    `,
  ],
})
export class FavoritoBtnComponent implements OnInit {
  @Input() id!: number | string;
  @Input() nombre!: string;
  @Input() tipo!: 'cancion' | 'artista' | 'album';
  @Input() imagen?: string;
  @Input() artista?: string;

  private favService = inject(FavoritosService);
  isFavorite = signal(false);

  constructor() {
    // Cuando los favoritos cambian, actualizar el estado local
    effect(() => {
      this.favService.favoritos();
      // Recalcular si es favorito cuando el servicio cambia
      this.isFavorite.set(this.favService.existeFavorito(this.id, this.tipo));
    });
  }

  ngOnInit(): void {
    if (!this.id || !this.nombre || !this.tipo) {
      console.error('FavoritoBtnComponent: Falta información requerida (id, nombre, tipo)');
    }
    // Inicializar estado
    this.isFavorite.set(this.favService.existeFavorito(this.id, this.tipo));
  }

  toggleFavorito(): void {
    if (this.isFavorite()) {
      this.favService.eliminarFavorito(this.id, this.tipo);
      this.isFavorite.set(false);
    } else {
      const item: FavoritoItem = {
        id: this.id,
        nombre: this.nombre,
        tipo: this.tipo,
        imagen: this.imagen,
        artista: this.artista,
      };
      this.favService.agregarFavorito(item);
      this.isFavorite.set(true);
    }
  }
}
