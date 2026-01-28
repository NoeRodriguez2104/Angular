import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// ======================
// INTERFACES REALES
// ======================

export interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  collectionName: string;
  trackTimeMillis: number;
}

export interface Artist {
  artistId: number;
  artistName: string;
  primaryGenreName: string;
  image?: string | null; // Imagen REAL añadida después
}

export interface Album {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl100: string;
  trackCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  constructor(private http: HttpClient) {}

  // DATOS PARA LA BÚSQUEDA DINÁMICA

  tracks = signal<Track[]>([]);
  artists = signal<Artist[]>([]);
  albums = signal<Album[]>([]);

  // DATOS FIJOS DEL HOME (PORTADA)

  homeTracks = signal<Track[]>([]);
  homeArtists = signal<Artist[]>([]);
  homeAlbums = signal<Album[]>([]);

  //  DATOS PARA PORTADA

  loadHomeSongs(limit = 24) {
    const url = `https://itunes.apple.com/search?term=a&entity=song&limit=${limit}`;
    this.http.get<any>(url).subscribe((resp) => {
      this.homeTracks.set(resp.results as Track[]);
    });
  }

  loadHomeAlbums(limit = 24) {
    const url = `https://itunes.apple.com/search?term=a&entity=album&limit=${limit}`;
    this.http.get<any>(url).subscribe((resp) => {
      this.homeAlbums.set(resp.results as Album[]);
    });
  }

  loadHomeArtists(limit = 24) {
    // URL de búsqueda con término general 'a' para obtener artistas populares
    const url = `https://itunes.apple.com/search?term=a&entity=musicArtist&limit=${limit}`;

    // Hacemos la petición HTTP GET
    this.http.get<any>(url).subscribe((resp) => {
      // Convertimos la respuesta a un array de artistas
      const rawArtists = resp.results as Artist[];

      // Iteramos sobre cada artista para obtener su imagen
      rawArtists.forEach((artist) => {
        // Llamamos a getArtistImage para buscar una canción del artista y extraer su imagen
        this.getArtistImage(artist.artistName).subscribe((img) => {
          // Guardamos la URL de la imagen en la propiedad 'image' del artista
          artist.image = img;
          // Actualizamos la señal homeArtists con los artistas modificados
          this.homeArtists.set([...rawArtists]);
        });
      });
    });
  }

  // OBTENER IMAGEN REAL DE ARTISTAS DESDE CANCIONES
  // iTunes no proporciona imagen del artista directamente, así que buscamos su canción más popular
  getArtistImage(artistName: string): Observable<string | null> {
    // Codificamos el nombre del artista para la URL
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
      artistName,
    )}&entity=song&limit=1`;

    // Hacemos la petición HTTP y extraemos la imagen de la canción (que tiene el arte del álbum)
    return this.http.get<any>(url).pipe(
      // map transforma la respuesta en solo la URL de la imagen o null si no existe
      map((resp) => resp.results?.[0]?.artworkUrl100 ?? null),
    );
  }

  // BÚSQUEDAS DINÁMICAS

  searchSongs(query: string, limit = 24, offset = 0) {
    const url = `https://itunes.apple.com/search?term=${query}&entity=song&limit=${limit}&offset=${offset}`;
    this.http.get<any>(url).subscribe((resp) => {
      this.tracks.set(resp.results as Track[]);
    });
  }

  searchAlbums(query: string, limit = 24, offset = 0) {
    const url = `https://itunes.apple.com/search?term=${query}&entity=album&limit=${limit}&offset=${offset}`;
    this.http.get<any>(url).subscribe((resp) => {
      this.albums.set(resp.results as Album[]);
    });
  }

  searchArtists(query: string, limit = 24) {
    // URL de búsqueda en iTunes para artistas musicales
    const url = `https://itunes.apple.com/search?term=${query}&entity=musicArtist&limit=${limit}`;

    // Hacemos la petición HTTP GET
    this.http.get<any>(url).subscribe((resp) => {
      // Convertimos la respuesta a un array de artistas
      const rawArtists = resp.results as Artist[];

      // Para cada artista, obtenemos su imagen desde sus canciones
      // Hacemos esto porque iTunes no proporciona imagen del perfil del artista directamente
      rawArtists.forEach((artist) => {
        // Llamamos a getArtistImage para buscar la canción más popular del artista
        this.getArtistImage(artist.artistName).subscribe((img) => {
          // Asignamos la imagen obtenida al objeto artista
          artist.image = img;
          // Actualizamos la señal para que Angular detecte el cambio y re-renderice los componentes
          this.artists.set([...rawArtists]);
        });
      });
    });
  }

  // DETALLE DE TRACK

  getTrackById(id: number): Observable<Track> {
    const url = `https://itunes.apple.com/lookup?id=${id}`;
    return this.http.get<any>(url).pipe(map((resp) => resp.results[0] as Track));
  }

  getTrendingSongs() {
    //primera peticion para obtener id de ranking itunes no la da
    const rssUrl = 'https://rss.applemarketingtools.com/api/v2/us/music/most-played/24/songs.json';

    this.http
      .get<any>(rssUrl)
      .pipe(
        map((response) => response.feed.results.map((track: any) => track.id)),
        switchMap((ids) => {
          if (ids.length === 0) {
            return of({ results: [] });
          }
          //aqui ya obtengo con los id las canciones
          const lookupUrl = `https://itunes.apple.com/lookup?id=${ids.join(',')}`;
          return this.http.get<any>(lookupUrl);
        }),
      )
      .subscribe((response) => {
        this.tracks.set(response.results as Track[]);
      });
  }
}
