import { Component, HostListener, ElementRef } from '@angular/core';

@Component({

  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'

})

export class ServicesComponent {

  elementsState: { transform: string }[] = []; // Eliminamos opacity

  constructor(private elRef: ElementRef) { }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const windowHeight = window.innerHeight;
    const elements = this.elRef.nativeElement.querySelectorAll('.zoom') as NodeListOf<HTMLElement>;

    elements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;

      if (!this.elementsState[index]) {
        this.elementsState[index] = { transform: 'scale(0.75)' }; // Inicializamos el estado
      }

      // Solo queremos afectar el escalado cuando el elemento está entrando desde la parte inferior
      if (elementTop > windowHeight * 0.75 && elementTop <= windowHeight) { // Solo cuando entra por la parte inferior
        const progress = (windowHeight - elementTop) / (windowHeight * 0.25); // Calculamos el progreso desde la parte inferior

        // Ajustar los límites para escalar
        if (progress <= 1) {
          const scale = 0.75 + progress * 0.25; // Escalado inicial
          this.elementsState[index].transform = `scale(${scale})`;
        } else {
          this.elementsState[index].transform = 'scale(1)'; // Escala completa
        }
      } else if (elementTop <= windowHeight * 0.75) {
        this.elementsState[index].transform = 'scale(1)'; // Mantener el tamaño completo
      } else {
        this.elementsState[index].transform = 'scale(0.75)'; // Estado inicial si no está visible
      }

      element.style.transform = this.elementsState[index].transform;
    });
  }
}