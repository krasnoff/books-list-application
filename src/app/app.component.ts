import { Component, OnInit, OnDestroy, TemplateRef, AfterViewChecked, OnChanges } from '@angular/core';
import {AppService} from './app.service';
import {Subscription} from 'rxjs';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { GoogleAuthService } from 'ng-gapi';
import { GlobalDataService } from './global-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppService, GlobalDataService]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked, OnChanges   {
  books: Array<any>;
  subscription: Subscription = null;
  modalElement: any;
  modalRef: BsModalRef;

  public isSubmited = false;

  Credentials = {
    access_token: "",
    refresh_token: ""
  }

  BookEditForm = {
    Id: "",
    BookTitle: "",
    AuthorsName: "",
    PublishedDate: ""
  }

  constructor(private _httpService:AppService, private modalService: BsModalService, private authService: GoogleAuthService, public gd: GlobalDataService) {}

  ngOnInit() {
    this.signIn();
  };

  ngAfterViewChecked() {
    //
  }

  ngOnChanges(changes) {
    console.log(changes);
  }

  public getData() {
    this.subscription = this._httpService.getMethod("https://www.googleapis.com/books/v1/mylibrary/bookshelves/0/volumes")
    .subscribe (
      data => {
        this.books = data;
      },
      error => {
        this.books = [];
      })
  }

  public signIn() {
    this.authService.getAuth().subscribe((auth) => {
      if (auth.isSignedIn.get()) {
        this.Credentials.access_token = auth.currentUser.get().getAuthResponse().access_token;
        this.Credentials.refresh_token = auth.currentUser.get().getAuthResponse().login_hint;
        this.gd["Credentials"] = this.Credentials;
        console.log(auth.currentUser.get().getBasicProfile())
        this.getData();
      }else {
        auth.signIn().then((response) => {
          this.Credentials.access_token = response.getAuthResponse().access_token;
          this.Credentials.refresh_token = response.getAuthResponse().login_hint;
          this.gd["Credentials"] = this.Credentials;
          console.log(response.getBasicProfile());
        })
      }
    },
    error => {
      debugger;
    })
  }

  ngOnDestroy() { 
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onBookEdit(el: any, template: TemplateRef<any>) {
    this.BookEditForm= Object.assign({}, el);
    this.modalRef = this.modalService.show(template);
  }

  onSave() {
    if (!this.isnullOrEmpty(this.BookEditForm.AuthorsName) ||
        !this.isnullOrEmpty(this.BookEditForm.BookTitle)) {
      this.isSubmited = true;
    }
    else {
      let updateItem = this.books.find(x => x.Id == this.BookEditForm.Id);
      let index = this.books.indexOf(updateItem);
      this.books[index] = this.BookEditForm;

      /*this.subscription = this._httpService.postMethod("json/booksList.json", JSON.stringify(this.BookEditForm))
        .subscribe (
          data => {
            debugger;
          },
          error => {
            alert(error._body);
          }
        );*/
      
      this.isSubmited = false;
      this.closeModal();
    }

    
  }

  findIndexToUpdate(newItem) { 
    return newItem;
  }

  isnullOrEmpty(str: string) : boolean {
    if(typeof str!='undefined' && str && str.trim() != ""){
      return true;
    } 
    else {
      return false;
    } 
  }

  onCancel() {
    this.closeModal();
  }

  private closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }
}
