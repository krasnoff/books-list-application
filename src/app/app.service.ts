import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private _http: Http) { }

  getMethod(url: string) {
    return this._http.get(url).pipe(map(res => res.json()))
  }
}
