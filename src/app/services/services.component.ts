import { Component, HostListener, ElementRef } from '@angular/core';

@Component({

  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'

})

export class ServicesComponent {

  elementsState: { transform: string; opacity: number }[] = [];

  constructor(private elRef: ElementRef) { }

  @HostListener('window:scroll', ['$event'])

  onScroll() {

    const windowHeight = window.innerHeight;
    const elements = this.elRef.nativeElement.querySelectorAll('.zoom') as NodeListOf<HTMLElement>;

    elements.forEach((element, index) => {

      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;

      if (!this.elementsState[index]) {

        this.elementsState[index] = { transform: 'scale(0.75)', opacity: 0 };

      }

      if (elementTop > windowHeight * 0.75 && elementTop <= windowHeight) {

        const progress = (windowHeight - elementTop) / (windowHeight * 0.25);

        if (progress <= 1) {

          const scale = 0.75 + progress * 0.25;
          const opacity = progress;

          this.elementsState[index].transform = `scale(${scale})`;
          this.elementsState[index].opacity = opacity;

        } else {

          this.elementsState[index].transform = 'scale(1)';
          this.elementsState[index].opacity = 1;

        }

      } else if (elementTop <= windowHeight * 0.75) {

        this.elementsState[index].transform = 'scale(1)';
        this.elementsState[index].opacity = 1;

      } else {

        this.elementsState[index].transform = 'scale(0.75)';
        this.elementsState[index].opacity = 0;

      }

      element.style.transform = this.elementsState[index].transform;
      element.style.opacity = this.elementsState[index].opacity.toString();

    });

  }

  booking() {

    window.open('https://reservas.castillobonavia.es/', '_blank');

  }
  
}