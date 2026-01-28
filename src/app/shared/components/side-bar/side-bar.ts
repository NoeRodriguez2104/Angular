import { Component, HostBinding } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-side-bar',
  standalone: true,
  templateUrl: './side-bar.html',
  styleUrls: ['./side-bar.css'],
  imports: [RouterLink, CommonModule],
})
export class SideBarComponent {
  expanded = false; //Estado interno , cuando true: Abierto y false: cerrado

  onMouseEnter() {
    console.log('ENTER');
    this.expanded = true; //cambia el estado de expansión
  }

  onMouseLeave() {
    console.log('LEAVE');
    this.expanded = false; // cambie el estado de expansión
  }

  isSearchMenuOpen = false;
  isFavoritosMenuOpen = false;
  isPerfilMenuOpen = false;

  onMouseEnterSearch() {
    this.isSearchMenuOpen = true;
  }
  onMouseLeaveSearch() {
    this.isSearchMenuOpen = false;
  }

  onMouseEnterFavoritos() {
    this.isFavoritosMenuOpen = true;
  }
  onMouseLeaveFavoritos() {
    this.isFavoritosMenuOpen = false;
  }

  onMouseEnterPerfil() {
    this.isPerfilMenuOpen = true;
  }
  onMouseLeavePerfil() {
    this.isPerfilMenuOpen = false;
  }
  @HostBinding('class.expanded')
  get isExpanded() {
    //getter que se evalúa para decidir si se añade la clase
    return this.expanded; // devolvemos valor de expanded.
  }
}
