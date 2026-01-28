// IMPORTACIONES de Angular Core
import { effect, Injectable, signal } from '@angular/core';
// - effect: Reemplaza a los Subscribers de RxJS/Observables del Angular antiguo
//          Ejecuta lado efecto cuando los signals cambian (reactividad automática)
// - Injectable: Decorador que permite inyectar este servicio en otros componentes/servicios
// - signal: Nueva forma de reactividad en Angular 17+, sustituye a BehaviorSubject

// ============================================================================
// INTERFAZ: Define la estructura de cada elemento de favoritos
// ============================================================================
export interface FavoritoItem {
  // ID único del favorito (puede ser número o string)
  id: number | string;

  // Nombre del artista, canción o álbum
  nombre: string;

  // Tipo discriminador para saber qué tipo de favorito es
  // Sustituye tener múltiples arrays separados como se hacía en Angular antiguo
  tipo: 'cancion' | 'artista' | 'album'; // Identificar qué tipo es

  // URL de la imagen (opcional)
  imagen?: string;

  // Nombre del artista (aplica para canciones y álbumes, opcional)
  artista?: string; // Para canciones y álbumes

  // Fecha en que se agregó a favoritos (generada automáticamente)
  fechaAgregado?: Date;
}

// ============================================================================
// SERVICIO DE FAVORITOS
// ============================================================================
// @Injectable: Decorador que registra este servicio como "inyectable"
// providedIn: 'root' - Usa Tree-shaking automático y singleton a nivel raíz
//                      Sustituye la antigua forma de declararlos en NgModule
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  // SIGNAL: Nueva primitiva de reactividad de Angular 17+ (sustituye BehaviorSubject)
  // - Más eficiente que Observables
  // - Reactividad granular (actualiza solo componentes que usan esta señal)
  // - No necesita unsubscribe como Observables (previene memory leaks automáticamente)
  // - Sintaxis más simple y clara que .subscribe()
  favoritos = signal<FavoritoItem[]>([]);

  // CONSTRUCTOR: Se ejecuta cuando se crea la instancia del servicio
  constructor() {
    // Cargar favoritos guardados en localStorage al inicializar
    this.cargarFavoritos();

    // EFFECT: Reemplaza a los ".subscribe()" del Angular antiguo
    // Se ejecuta automáticamente cada vez que favoritos() cambia
    // Sustituye: subscription = this.favoritos.subscribe(data => {...})
    // Ventaja: Se desuscribe automáticamente cuando el componente se destruye
    effect(() => {
      // Cada vez que favoritos cambia, guarda en localStorage automáticamente
      localStorage.setItem(
        'favoritos',
        JSON.stringify(this.favoritos()), // Paréntesis () lee el valor actual del signal
      );
    });
  }

  // MÉTODO PRIVADO: Carga favoritos del localStorage en el constructor
  private cargarFavoritos(): void {
    // Obtiene string JSON del localStorage
    const guardados = localStorage.getItem('favoritos');

    // Si existen datos guardados
    if (guardados) {
      // Convierte JSON string a array y lo asigna al signal
      // Sustituye: this.favoritos.next(JSON.parse(guardados))
      // Diferencia: signal.set() es más directo que BehaviorSubject.next()
      this.favoritos.set(JSON.parse(guardados));
    }
  }

  // MÉTODO PÚBLICO: Agrega un nuevo favorito a la lista
  agregarFavorito(item: FavoritoItem): void {
    // Verifica si el favorito ya existe (evita duplicados)
    // Sustituye la lógica manual que se hacía con .some() en observables
    if (this.existeFavorito(item.id, item.tipo)) return;

    // SIGNAL UPDATE: Actualiza el array de manera funcional e inmutable
    // Sustituye: this.favoritos.next([...this.favoritos.value, newItem])
    // update() toma el valor actual y retorna el nuevo valor
    this.favoritos.update((list) => [
      ...list, // Propagar todos los items existentes (inmutabilidad)
      {
        ...item,
        fechaAgregado: new Date(), // Agrega automáticamente la fecha actual
      },
    ]);
  }

  // MÉTODO PÚBLICO: Elimina un favorito de la lista
  eliminarFavorito(id: number | string, tipo: string): void {
    // update() filtra eliminando solo el item que coincida con id y tipo
    // Sustituye la lógica con .pipe(map(list => list.filter(...)))
    this.favoritos.update((list) =>
      // Filtra manteniendo solo los items que NO coincidan con id y tipo
      list.filter((f) => !(f.id === id && f.tipo === tipo)),
    );
  }

  // MÉTODO PÚBLICO: Limpia todos los favoritos
  limpiarFavoritos(): void {
    // Asigna array vacío al signal
    // Sustituye: this.favoritos.next([])
    this.favoritos.set([]);

    // También elimina del localStorage
    localStorage.removeItem('favoritos');
  }

  // MÉTODO PÚBLICO: Verifica si un favorito ya existe
  existeFavorito(id: number | string, tipo: string): boolean {
    // Devuelve true si encuentra un item con ese id y tipo
    // this.favoritos() obtiene el array actual del signal
    // .some() itera hasta encontrar una coincidencia
    return this.favoritos().some((f) => f.id === id && f.tipo === tipo);
  }
}
