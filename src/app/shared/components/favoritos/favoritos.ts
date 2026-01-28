import { Component, computed, signal, inject } from '@angular/core';
import { FavoritosService, FavoritoItem } from '../../../core/services/favoritos-service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css',
})
export class FavoritosComponent {
  private favService = inject(FavoritosService);

  filtroActivo = signal<'todos' | 'canciones' | 'artistas' | 'albumes'>('todos');

  favoritos = this.favService.favoritos;

  favoritosFiltrados = computed(() => {
    const filtro = this.filtroActivo();
    const todos = this.favoritos();

    switch (filtro) {
      case 'canciones':
        return todos.filter((f) => f.tipo === 'cancion');
      case 'artistas':
        return todos.filter((f) => f.tipo === 'artista');
      case 'albumes':
        return todos.filter((f) => f.tipo === 'album');
      default:
        return todos;
    }
  });

  obtenerConteo = computed(() => {
    const todos = this.favoritos();
    return {
      canciones: todos.filter((f) => f.tipo === 'cancion').length,
      artistas: todos.filter((f) => f.tipo === 'artista').length,
      albumes: todos.filter((f) => f.tipo === 'album').length,
    };
  });

  setFiltro(filtro: 'todos' | 'canciones' | 'artistas' | 'albumes'): void {
    this.filtroActivo.set(filtro);
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
        return '❓';
    }
  }
}
