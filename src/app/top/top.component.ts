import { Component, OnInit } from '@angular/core';

import { MainService } from '../main.service';

@Component({

  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrl: './top.component.scss'

})

export class TopComponent implements OnInit {

  isLoading: boolean = true;

  showExitButton: boolean = false;

  tops: any[] = [];

  constructor(private mainService: MainService) { }

  ngOnInit(): void {

    this.getTops();

  }

  getTops(): void {

    this.mainService.gameAllService().subscribe({

      next: (data: any) => {

        this.tops = [];

        data.forEach((top: any, index: number) => {

          setTimeout(() => {
            this.tops.push(top);
          }, index * 250);
          
        });

        const totalAnimationTime = data.length * 250;

        setTimeout(() => {
          this.showExitButton = true;
        }, totalAnimationTime);

        this.isLoading = false;

      },

    });

  }

}