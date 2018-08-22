import { Component, OnInit, OnDestroy } from '@angular/core';
import {AppService} from './app.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppService]
})
export class AppComponent implements OnInit, OnDestroy {
  books: Array<any>;
  subscription: Subscription = null;

  constructor(private _httpService:AppService) {}

  ngOnInit() {
    this.subscription = this._httpService.getMethod("json/booksList.json")
    .subscribe (
      data => {
        this.books = data;
      },
      error => {
        this.books = [];
      })
  };

  ngOnDestroy() { 
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
