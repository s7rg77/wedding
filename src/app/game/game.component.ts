import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { MainService } from '../main.service';
import { SegaService } from '../sega.service';

@Component({

  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'

})

export class GameComponent {

  ramoElement: HTMLElement | null = null;
  newRecord: boolean = false;

  buttonLabel = 'START';
  buttonsVisible: boolean = true;
  buttonVisible: boolean = true;
  isSaving: boolean = false;

  fillLevel = 0;
  isRunning = false;
  selectedPower = 0;
  direction = 1;

  angle = 0;
  angleDirection = -1;
  isDialRunning = false;
  selectedAngle = 0;

  windSpeed: number = 0;
  windDirection: boolean = true;

  distanceInMeters: number = 0;

  bridePosition = 137;
  groundPosition = 0;
  meters: number[] = Array.from({ length: 150 }, (_, i) => i);

  showData: boolean = false;
  message: string = "";

  showMarriedImage: boolean = false;

  constructor(

    private router: Router,
    private http: HttpClient,
    private mainService: MainService,
    private segaService: SegaService

  ) { }

  ngOnInit() {

    this.ramoElement = document.querySelector('.flowers') as HTMLElement;

    this.segaService.groundPosition$.subscribe(position => {

      this.groundPosition = position;

    });

  }

  handleButtonClick() {

    switch (this.buttonLabel) {

      case 'START':
        this.buttonsVisible = false;
        this.startPowerSelection();
        this.buttonLabel = 'POWER';
        break;

      case 'POWER':
        this.stopPowerSelection();
        this.buttonLabel = 'ANGLE';
        break;

      case 'ANGLE':
        this.buttonVisible = false;
        this.stopDialMovement();
        this.buttonLabel = 'RESTART';
        break;

      case 'RESTART':
        this.resetGame();
        this.buttonLabel = 'START';
        break;

    }

  }

  startPowerSelection() {

    if (this.isRunning) return;

    this.isRunning = true;
    this.fillLevel = 0;
    this.selectedPower = 0;
    this.direction = 1;

    let lastTime = performance.now();

    const animatePowerBar = (currentTime: number) => {

      const deltaTime = currentTime - lastTime;

      lastTime = currentTime;

      const maxSpeed = 10;
      const minSpeed = 0.1;
      const speedFactor = minSpeed + (maxSpeed - minSpeed) * Math.pow(this.fillLevel / 100, 1);

      this.fillLevel += this.direction * speedFactor * (deltaTime / 16);

      if (this.fillLevel >= 100) {

        this.fillLevel = 100;
        this.direction = -1;

      } else if (this.fillLevel <= 0) {

        this.fillLevel = 0;
        this.direction = 1;

      }

      if (this.isRunning) {

        requestAnimationFrame(animatePowerBar);

      }

    };

    requestAnimationFrame(animatePowerBar);

  }

  stopPowerSelection() {

    if (!this.isRunning) return;

    this.isRunning = false;
    this.selectedPower = this.fillLevel;
    this.startDialMovement();

  }

  startDialMovement() {

    if (this.isDialRunning) return;

    this.isDialRunning = true;

    let lastTime = performance.now();

    const animateDial = (currentTime: number) => {

      const deltaTime = currentTime - lastTime;

      lastTime = currentTime;

      const maxSpeed = 5;
      const minSpeed = 0.05;
      const normalizedAngle = (this.angle + 90) / 90;
      const angleSpeed = minSpeed + (maxSpeed - minSpeed) * Math.sin(normalizedAngle * Math.PI);

      this.angle += this.angleDirection * angleSpeed * (deltaTime / 16);

      if (this.angle >= 0) {

        this.angle = 0;
        this.angleDirection = -1;

      } else if (this.angle <= -90) {

        this.angle = -90;
        this.angleDirection = 1;

      }

      if (this.isDialRunning) {

        requestAnimationFrame(animateDial);

      }

    };

    requestAnimationFrame(animateDial);

  }

  stopDialMovement() {

    if (!this.isDialRunning) return;

    this.isDialRunning = false;

    this.selectedAngle = Math.abs(parseFloat(this.angle.toFixed(2)));

    if (this.selectedAngle > 0) {

      this.selectedAngle = 90 - this.selectedAngle;

    }

    setTimeout(() => {

      this.buttonVisible = true;
      this.buttonsVisible = true;
      this.showData = true;
      this.showMarriedImage = true;

    }, 2500);

    this.moveGround(this.selectedPower, this.selectedAngle);

  }

  moveGround(fuerza: number, angle: number) {

    this.windSpeed = parseFloat((Math.random() * 100).toFixed(2));
    this.windDirection = Math.random() < 0.75;
    this.message = "";

    const positiveAngle = Math.abs(angle);

    let valorDelAngulo: number;

    if (positiveAngle > 90) {

      valorDelAngulo = 0;

    } else if (positiveAngle <= 45) {

      valorDelAngulo = parseFloat((positiveAngle / 4.5).toFixed(2));

    } else {

      valorDelAngulo = parseFloat(((90 - positiveAngle) / 4.5).toFixed(2));

    }

    let distance = parseFloat(((fuerza / 10) * valorDelAngulo).toFixed(2));

    if (this.windDirection) {

      distance += parseFloat((this.windSpeed / 2).toFixed(2));

    } else {

      distance -= parseFloat((this.windSpeed / 4).toFixed(2));

    }

    distance = parseFloat(Math.max(distance, 0).toFixed(2));

    this.distanceInMeters = parseFloat((distance).toFixed(2));

    this.mainService.gameMinService().subscribe(response => {

      const minDist = response.min_dist;

      if (minDist === null || this.distanceInMeters > minDist) {

        this.newRecord = true;
        this.message = "ENHORABUENA ERES TOP 10!!!";

      } else {

        this.newRecord = false;

        const messages = [

          "prueba OTRA VEZ",
          "sigue INTENTÁNDOLO",
          "no entras en el TOP 10",
          "dedícate al PING PONG!!!",
          "PPPFFFFFFF!!!",
          "FATAL!!!",
          "NADA!!!"

        ];

        const randomIndex = Math.floor(Math.random() * messages.length);
        this.message = messages[randomIndex];

      }

    });

    const desplazamiento = parseFloat((distance * 50).toFixed(2));

    this.bridePosition = desplazamiento;
    this.groundPosition = desplazamiento;
    
    this.segaService.updateGroundPosition(desplazamiento);

    if (this.ramoElement) {

      this.ramoElement.classList.add('animate-up', 'rotate');

      setTimeout(() => {

        if (this.ramoElement) {

          this.ramoElement.classList.remove('animate-up');
          this.ramoElement.classList.add('animate-down');
          this.ramoElement.classList.remove('rotate');

        }

      }, 1250);

    }

  }

  saveRecord() {

    if (this.isSaving) {

      return;

    }

    const nameInput = (document.getElementById('nameInput') as HTMLInputElement);
    const name = nameInput.value.trim();

    if (!name) {

      this.message = "tu NOMBRE!!!";
      return;

    }

    if (name.length > 10) {

      this.message = "máximo 10 (diez) CARACTERES";
      return;

    }

    this.isSaving = true;

    const data = {

      game_name: name,
      game_power: this.selectedPower,
      game_angle: this.selectedAngle,
      game_wind: this.windSpeed,
      game_dist: this.distanceInMeters

    };

    this.http.post('https://onnetwo.com/game_add.php', data).subscribe({

      next: () => {

        this.message = "record GUARDADO!!!";
        this.newRecord = false;
        nameInput.value = '';

      },

      error: () => {

        this.message = "error al GUARDAR!!!";

      },

      complete: () => {

        this.isSaving = false;

      }

    });

  }

  resetGame() {

    this.fillLevel = 0;
    this.selectedPower = 0;
    this.isRunning = false;
    this.direction = 1;
    this.angle = 0;
    this.isDialRunning = false;
    this.selectedAngle = 0;
    this.bridePosition = 137;
    this.groundPosition = 0;
    this.showData = false;
    this.showMarriedImage = false;

    if (this.ramoElement) {

      this.ramoElement.classList.remove('animate-up', 'animate-down');

    }

    this.segaService.updateGroundPosition(0);

  }

  view() {

    this.resetGame();
    this.router.navigate(['/top']);

  }

  exit() {

    this.resetGame();
    this.router.navigate(['/']);

  }
  
}