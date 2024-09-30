import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MainService {

  private get = 'https://onnetwo.com/get.php';
  private mod = 'https://onnetwo.com/mod.php';
  private del = 'https://onnetwo.com/del.php';
  private add = 'https://onnetwo.com/add.php';

  constructor(private http: HttpClient) { }

  getService(user_mail: string): Observable<any> {

    const url = `${this.get}?user_email=${user_mail}`;
    return this.http.get<any>(url);

  }

  modService(formData: any): Observable<any> {

    return this.http.post<any>(this.mod, formData);

  }

  delService(user_id: number): Observable<any> {

    return this.http.post<any>(this.del, { user_id });

  }

  addService(formData: any): Observable<any> {

    return this.http.post<any>(this.add, formData);

  }

}