import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Track } from './music';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private _currentTrack = signal<Track | null>(null);
  private _isPlaying = signal(false);
  private _currentTime = signal(0);
  private _duration = signal(0);
  private _volume = signal(1);
  private _playlist = signal<Track[]>([]);
  private _currentIndex = signal(0);

  private platformId = inject(PLATFORM_ID);
  
  // Audio element reference
  private audio: HTMLAudioElement | null = null;

  // Computed signals
  progress = computed(() => {
    const duration = this._duration();
    return duration > 0 ? (this._currentTime() / duration) * 100 : 0;
  });

  currentTrack = () => this._currentTrack();
  isPlaying = () => this._isPlaying();
  currentTime = () => this._currentTime();
  duration = () => this._duration();
  volume = () => this._volume();
  playlist = () => this._playlist();
  currentIndex = () => this._currentIndex();

  constructor() {
    this.initAudio();
  }

  private initAudio() {
    // Only initialize Audio on the browser, not on the server
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.audio = new Audio();
    this.audio.addEventListener('timeupdate', () => {
      this._currentTime.set(this.audio?.currentTime ?? 0);
    });
    this.audio.addEventListener('loadedmetadata', () => {
      this._duration.set(this.audio?.duration ?? 0);
    });
    this.audio.addEventListener('ended', () => {
      this.next();
    });
  }

  play(track: Track) {
    if (this._currentTrack()?.id === track.id && this._isPlaying()) {
      return; // Already playing
    }

    this._currentTrack.set(track);
    this._currentTime.set(0);

    if (track.previewUrl) {
      if (this.audio) {
        this.audio.src = track.previewUrl;
        this.audio.play().catch(err => console.error('Play error:', err));
        this._isPlaying.set(true);
      }
    } else {
      console.warn('No preview URL for track:', track.title);
    }
  }

  togglePlayPause() {
    if (!this.audio) return;

    if (this._isPlaying()) {
      this.audio.pause();
      this._isPlaying.set(false);
    } else {
      this.audio.play().catch(err => console.error('Play error:', err));
      this._isPlaying.set(true);
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this._isPlaying.set(false);
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this._isPlaying.set(false);
      this._currentTrack.set(null);
      this._currentTime.set(0);
    }
  }

  next() {
    const playlist = this._playlist();
    let nextIndex = this._currentIndex() + 1;

    if (nextIndex >= playlist.length) {
      nextIndex = 0; // Loop back to start
    }

    this._currentIndex.set(nextIndex);
    const nextTrack = playlist[nextIndex];
    if (nextTrack) {
      this.play(nextTrack);
    }
  }

  previous() {
    const playlist = this._playlist();
    let prevIndex = this._currentIndex() - 1;

    if (prevIndex < 0) {
      prevIndex = playlist.length - 1;
    }

    this._currentIndex.set(prevIndex);
    const prevTrack = playlist[prevIndex];
    if (prevTrack) {
      this.play(prevTrack);
    }
  }

  setPlaylist(tracks: Track[]) {
    this._playlist.set(tracks);
    if (tracks.length > 0) {
      this._currentIndex.set(0);
    }
  }

  seek(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
      this._currentTime.set(time);
    }
  }

  setVolume(volume: number) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this._volume.set(clampedVolume);
    if (this.audio) {
      this.audio.volume = clampedVolume;
    }
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
