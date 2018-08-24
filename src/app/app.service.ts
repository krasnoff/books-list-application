import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import { map } from 'rxjs/operators';
import { GlobalDataService } from './global-data.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private _http: Http, protected gd: GlobalDataService) { }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    
    if (this.gd["Credentials"])
      headers.append('Authorization', 'Bearer ' + this.gd["Credentials"].access_token);
  }

  getMethod(url: string) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);

    return this._http.get(url, { headers: headers }).pipe(map(res => res.json()))
  }

  postMethod(url: string, body: string) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);

    return this._http.post(url, body, { headers: headers }).pipe(
        map(res => res.json()));
  }
}