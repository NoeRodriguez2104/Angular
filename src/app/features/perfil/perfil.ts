import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FavoritosComponent } from '../../shared/components/favoritos/favoritos';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FavoritosComponent, RouterLink, RouterOutlet],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilComponent {}
