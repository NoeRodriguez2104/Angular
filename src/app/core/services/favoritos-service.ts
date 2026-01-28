import { Injectable, signal } from '@angular/core';

// Tipos para favoritos
export interface FavoritoItem {
  id: number | string;
  nombre: string;
  tipo: 'cancion' | 'artista' | 'album'; // Identificar qué tipo es
  imagen?: string;
  artista?: string; // Para canciones y álbumes
  fechaAgregado?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  // Signal con lista de favoritos
  favoritos = signal<FavoritoItem[]>([]);

  constructor() {
    this.cargarFavoritos();
  }

  /**
   * Cargar favoritos desde localStorage
   */
  private cargarFavoritos(): void {
    const favoritos = localStorage.getItem('favoritos');
    if (favoritos) {
      try {
        this.favoritos.set(JSON.parse(favoritos));
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
      }
    }
  }

  /**
   * Guardar favoritos en localStorage
   */
  private guardarFavoritos(): void {
    localStorage.setItem('favoritos', JSON.stringify(this.favoritos()));
  }

  /**
   * Añadir un elemento a favoritos
   */
  agregarFavorito(item: FavoritoItem): void {
    const favoritos = this.favoritos();
    // Verificar si ya existe
    if (!this.existeFavorito(item.id, item.tipo)) {
      item.fechaAgregado = new Date();
      this.favoritos.set([...favoritos, item]);
      this.guardarFavoritos();
      console.log(`${item.nombre} añadido a favoritos`);
    }
  }

  /**
   * Eliminar un elemento de favoritos
   */
  eliminarFavorito(id: number | string, tipo: string): void {
    const favoritos = this.favoritos().filter((fav) => !(fav.id === id && fav.tipo === tipo));
    this.favoritos.set(favoritos);
    this.guardarFavoritos();
    console.log(`Favorito eliminado`);
  }

  /**
   * Verificar si un elemento ya es favorito
   */
  existeFavorito(id: number | string, tipo: string): boolean {
    return this.favoritos().some((fav) => fav.id === id && fav.tipo === tipo);
  }

  /**
   * Obtener solo canciones de favoritos
   */
  obtenerCancionessFav(): FavoritoItem[] {
    return this.favoritos().filter((fav) => fav.tipo === 'cancion');
  }

  /**
   * Obtener solo artistas de favoritos
   */
  obtenerArtistasFav(): FavoritoItem[] {
    return this.favoritos().filter((fav) => fav.tipo === 'artista');
  }

  /**
   * Obtener solo álbumes de favoritos
   */
  obtenerAlbumesFav(): FavoritoItem[] {
    return this.favoritos().filter((fav) => fav.tipo === 'album');
  }

  /**
   * Limpiar todos los favoritos
   */
  limpiarFavoritos(): void {
    this.favoritos.set([]);
    localStorage.removeItem('favoritos');
  }
}
