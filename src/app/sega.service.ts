import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({

  providedIn: 'root'

})

export class SegaService {

  private groundPositionSource = new BehaviorSubject<number>(0);
  groundPosition$ = this.groundPositionSource.asObservable();

  updateGroundPosition(position: number) {

    this.groundPositionSource.next(position);
    
  }

}