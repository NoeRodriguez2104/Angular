import { Component, OnInit, effect } from '@angular/core';
import { FavoritosService, FavoritoItem } from '../../../core/services/favoritos-service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css',
})
export class FavoritosComponent implements OnInit {
  filtroActivo: 'todos' | 'canciones' | 'artistas' | 'albumes' = 'todos';
  favoritos: FavoritoItem[] = [];
  favoritosFiltrados: FavoritoItem[] = [];

  constructor(private favService: FavoritosService) {
    // Usar effect para observar cambios en el Signal
    effect(() => {
      this.favoritos = this.favService.favoritos();
      this.aplicarFiltro();
    });
  }

  ngOnInit(): void {
    // Cargar favoritos iniciales
    this.favoritos = this.favService.favoritos();
    this.aplicarFiltro();
  }

  setFiltro(filtro: 'todos' | 'canciones' | 'artistas' | 'albumes'): void {
    this.filtroActivo = filtro;
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    switch (this.filtroActivo) {
      case 'canciones':
        this.favoritosFiltrados = this.favService.obtenerCancionessFav();
        break;
      case 'artistas':
        this.favoritosFiltrados = this.favService.obtenerArtistasFav();
        break;
      case 'albumes':
        this.favoritosFiltrados = this.favService.obtenerAlbumesFav();
        break;
      default:
        this.favoritosFiltrados = this.favoritos;
    }
  }

  eliminarFavorito(item: FavoritoItem): void {
    this.favService.eliminarFavorito(item.id, item.tipo);
  }

  limpiarTodos(): void {
    if (confirm('¿Estás seguro de que quieres eliminar todos los favoritos?')) {
      this.favService.limpiarFavoritos();
    }
  }

  obtenerIcono(tipo: string): string {
    switch (tipo) {
      case 'cancion':
        return '🎵';
      case 'artista':
        return '🎤';
      case 'album':
        return '💿';
      default:
        return '⭐';
    }
  }

  obtenerConteo(): { canciones: number; artistas: number; albumes: number } {
    return {
      canciones: this.favService.obtenerCancionessFav().length,
      artistas: this.favService.obtenerArtistasFav().length,
      albumes: this.favService.obtenerAlbumesFav().length,
    };
  }
}
