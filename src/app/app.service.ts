import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private _http: Http) { }

  createAuthorizationHeader(headers: Headers) {
    /*headers.append('X-PINGOTHER', 'pingpong');
    headers.append('Content-Type', 'application/json');

    if (this.gd["token"] != undefined && this.gd["token"] != null && this.gd["token"] != "") {
      headers.append('Authorization', 'Bearer ' + this.gd["token"]);
    }*/
  }

  getMethod(url: string) {
    return this._http.get(url).pipe(map(res => res.json()))
  }

  postMethod(url: string, body: string) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);

    return this._http.post(url, body, { headers: headers }).pipe(
        map(res => res.json()));
  }
}
