import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({

  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'

})

export class MainComponent implements OnInit {

  days!: number;
  hours!: number;
  minutes!: number;
  seconds!: number;

  targetDate = new Date('June 28, 2025 12:30:00').getTime();

  png02Translate: number = 0;
  png03Translate: number = 0;
  png04Translate: number = 0;
  png05Translate: number = 0;
  png06Translate: number = 0;
  png07Translate: number = 0;
  png08Translate: number = 0;
  png09Translate: number = 0;

  @ViewChild('png02', { static: true }) png02!: ElementRef;
  @ViewChild('png03', { static: true }) png03!: ElementRef;
  @ViewChild('png04', { static: true }) png04!: ElementRef;
  @ViewChild('png05', { static: true }) png05!: ElementRef;
  @ViewChild('png06', { static: true }) png06!: ElementRef;
  @ViewChild('png07', { static: true }) png07!: ElementRef;
  @ViewChild('png08', { static: true }) png08!: ElementRef;
  @ViewChild('png09', { static: true }) png09!: ElementRef;

  @ViewChild('elenasergio', { static: true }) elenasergio!: ElementRef;

  observer: IntersectionObserver | undefined;

  countdownInterval: any;

  ngOnInit() {

    this.initParallax();

    this.updateCountdown();

  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  initParallax() {

    const options = {
      root: null,
      threshold: 0

    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateParallax();
          window.addEventListener('scroll', this.updateParallax.bind(this));
        } else {
          window.removeEventListener('scroll', this.updateParallax.bind(this));
        }
      });
    }, options);

    this.observer.observe(this.png02.nativeElement);
    this.observer.observe(this.png03.nativeElement);
    this.observer.observe(this.png04.nativeElement);
    this.observer.observe(this.png05.nativeElement);
    this.observer.observe(this.png06.nativeElement);
    this.observer.observe(this.png07.nativeElement);
    this.observer.observe(this.png08.nativeElement);
    this.observer.observe(this.png09.nativeElement);

  }

  updateParallax() {

    const scrollPosition = window.scrollY;

    this.png02Translate = -scrollPosition * 0.05;
    this.png03Translate = -scrollPosition * 0.15;
    this.png04Translate = -scrollPosition * 0.2;
    this.png05Translate = -scrollPosition * 0.1;
    this.png06Translate = -scrollPosition * 0.03;
    this.png07Translate = -scrollPosition * 0.075;
    this.png08Translate = -scrollPosition * 0.25;
    this.png09Translate = -scrollPosition * 0.04;

    this.updateFadeEffect(scrollPosition);

  }

  updateFadeEffect(scrollPosition: number) {

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollPosition / scrollHeight;
    const fadeFactor = 7.5;
    const opacityValue = 1 - (scrollPercentage * fadeFactor);

    this.elenasergio.nativeElement.style.opacity = Math.max(0, Math.min(1, opacityValue)).toString();

  }

  updateCountdown() {

    const now = new Date().getTime();
    const distance = this.targetDate - now;

    this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
      this.days = this.hours = this.minutes = this.seconds = 0;
    } else {
      setTimeout(() => this.updateCountdown(), 1000);
    }

  }

  addToGoogleCalendar() {

    const startDate = new Date(this.targetDate);
    const endDate = new Date(startDate.getTime() + 12 * 60 * 60 * 1000);
    const event = {

      title: "Boda de Elena y Sergio",
      description: "No te pierdas este gran evento",
      location: "Castillo Bonavia",
      start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

    };

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`;

    window.open(url, '_blank');

  }

}