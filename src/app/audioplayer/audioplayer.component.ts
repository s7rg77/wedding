import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-audioplayer',
  templateUrl: './audioplayer.component.html',
  styleUrls: ['./audioplayer.component.scss']
})

export class AudioPlayerComponent implements AfterViewInit {

  @ViewChild('audio') audioRef!: ElementRef<HTMLAudioElement>;

  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 1;

  ngAfterViewInit(): void {

    if (this.audioRef && this.audioRef.nativeElement) {

      const audio = this.audioRef.nativeElement;

      audio.addEventListener('loadedmetadata', () => {
        this.duration = audio.duration;
      });

      audio.addEventListener('timeupdate', () => {
        this.currentTime = audio.currentTime;
      });

    }

  }

  togglePlayPause() {

    if (this.audioRef && this.audioRef.nativeElement) {

      const audio = this.audioRef.nativeElement;

      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }

      this.isPlaying = !this.isPlaying;

    }

  }

  seek(event: Event) {

    const progressBar = event.target as HTMLInputElement;
    const newTime = (parseFloat(progressBar.value) / 100) * this.duration;

    if (this.audioRef && this.audioRef.nativeElement) {

      const audio = this.audioRef.nativeElement;
      audio.currentTime = newTime;

    }

  }

  updateVolume(event: Event) {

    const input = event.target as HTMLInputElement;

    this.volume = parseFloat(input.value);

    if (this.audioRef && this.audioRef.nativeElement) {

      const audio = this.audioRef.nativeElement;
      audio.volume = this.volume;

    }

  }

}