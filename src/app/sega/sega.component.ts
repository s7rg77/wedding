import { Component, OnInit } from '@angular/core';

import { SegaService } from '../sega.service';

@Component({

  selector: 'app-sega',
  templateUrl: './sega.component.html',
  styleUrl: './sega.component.scss'

})

export class SegaComponent implements OnInit {

  sky01 = Array.from({ length: 20 }, (_, i) => `/assets/sky01.png`);
  sky02 = Array.from({ length: 20 }, (_, i) => `/assets/sky02.png`);
  ground01 = Array.from({ length: 20 }, (_, i) => `/assets/ground01.png`);
  ground02 = Array.from({ length: 20 }, (_, i) => `/assets/ground02.png`);

  groundPosition: number = 0;

  constructor(private segaService: SegaService) { }

  ngOnInit(): void {

    this.segaService.groundPosition$.subscribe(position => {

      this.groundPosition = position;
      this.updatePositions();

    });

  }

  updatePositions(): void {

    const groundMovement = this.groundPosition;
    const skyMovement1 = groundMovement;
    const skyMovement2 = groundMovement;

    const ground01 = document.querySelector('.ground01') as HTMLElement;
    const ground02 = document.querySelector('.ground02') as HTMLElement;
    const sky01 = document.querySelector('.sky01') as HTMLElement;
    const sky02 = document.querySelector('.sky02') as HTMLElement;

    if (ground01 && ground02) {

      ground01.style.transform = `translateX(-${groundMovement}px)`;
      ground02.style.transform = `translateX(-${groundMovement}px)`;

    }

    if (sky01 && sky02) {

      sky01.style.transform = `translateX(-${skyMovement1}px)`;
      sky02.style.transform = `translateX(-${skyMovement2}px)`;

    }
    
  }

}