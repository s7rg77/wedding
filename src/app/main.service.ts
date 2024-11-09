import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({

  providedIn: 'root'

})

export class MainService {

  private get = 'https://onnetwo.com/get.php';
  private add = 'https://onnetwo.com/add.php';
  private mod = 'https://onnetwo.com/mod.php';
  private del = 'https://onnetwo.com/del.php';

  private gameall = 'https://onnetwo.com/game_all.php';
  private gamemin = 'https://onnetwo.com/game_min.php';
  private gameadd = 'https://onnetwo.com/game_add.php';

  constructor(private http: HttpClient) { }

  getService(user_mail: string): Observable<any> {

    const url = `${this.get}?user_email=${user_mail}`;
    return this.http.get<any>(url);

  }

  addService(formData: any): Observable<any> {

    return this.http.post<any>(this.add, formData);

  }

  modService(formData: any): Observable<any> {

    return this.http.post<any>(this.mod, formData);

  }

  delService(user_id: number): Observable<any> {

    return this.http.post<any>(this.del, { user_id });

  }

  gameAllService(): Observable<any> {

    return this.http.get<any>(this.gameall);

  }

  gameMinService(): Observable<any> {

    return this.http.get<any>(this.gamemin);

  }

  gameAddService(gameData: any): Observable<any> {

    return this.http.post<any>(this.gameadd, gameData);

  }

}