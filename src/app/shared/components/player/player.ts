import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../core/services/player';
import { MusicService } from '../../../core/services/music';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.html',
  styleUrls: ['./player.css']
})
export class PlayerComponent implements OnInit {
  Math = Math;

  constructor(
    public playerService: PlayerService,
    private musicService: MusicService
  ) {}

  ngOnInit() {
    // Initialize with all available tracks
    this.playerService.setPlaylist(this.musicService.tracks());
  }

  playTrack(id: string) {
    const track = this.musicService.byId(id);
    if (track) {
      this.playerService.play(track);
    }
  }

  onProgressChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const time = (parseFloat(input.value) / 100) * this.playerService.duration();
    this.playerService.seek(time);
  }

  onVolumeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.playerService.setVolume(parseFloat(input.value) / 100);
  }
}
