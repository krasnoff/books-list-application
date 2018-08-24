import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, ElementRef, Renderer } from '@angular/core';
import {AppService} from './app.service';
import {Subscription, Observable} from 'rxjs';
import 'rxjs/add/observable/timer';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { GlobalDataService } from './global-data.service';
import { GoogleAuthService } from 'ng-gapi';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppService, GlobalDataService]
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('butGetData') butGetData:ElementRef;

  books: Array<any>;
  subscription: Subscription = null;
  modalElement: any;
  modalRef: BsModalRef;
  modalRefDelete: BsModalRef;
  noRecs: boolean;

  public isSubmited = false;

  BookEditForm: any;

  constructor(private _httpService:AppService, private modalService: BsModalService, public gd: GlobalDataService, private authService: GoogleAuthService, private renderer:Renderer) {
    
  }

  ngOnInit() {
    //this.signIn();
  };

  public getData() {
    this.subscription = this._httpService.getMethod("https://www.googleapis.com/books/v1/mylibrary/bookshelves/0/volumes")
    .subscribe (
      data => {
        this.books = data.items;
        if (this.books.length > 0)
          this.noRecs = true;
        else
          this.noRecs = false;
      },
      error => {
        this.books = [];
      })
  }

  public deleteData() {
    this.subscription = this._httpService.postMethod("https://www.googleapis.com/books/v1/mylibrary/bookshelves/0/removeVolume", "volumeId=" + this.BookEditForm.id)
    .subscribe (
      data => {
        debugger;
      },
      error => {
        debugger;
      })
  }

  onLogin() {
    this.signIn();
  }

  public signIn() {
    this.authService.getAuth().subscribe((auth) => {
      if (auth.isSignedIn.get()) {
        this.gd["Credentials"] = {
          access_token: auth.currentUser.get().getAuthResponse().access_token,
          refresh_token: auth.currentUser.get().getAuthResponse().login_hint
        };
        console.log(auth.currentUser.get().getBasicProfile())
        this.getData();
        let event = new MouseEvent('click', {bubbles: true});
        this.renderer.invokeElementMethod(
          this.butGetData.nativeElement, 'dispatchEvent', [event]);
      }else {
        auth.signIn().then((response) => {
          this.gd["Credentials"] = {
            access_token: auth.currentUser.get().getAuthResponse().access_token,
            refresh_token: auth.currentUser.get().getAuthResponse().login_hint
          };
          console.log(response.getBasicProfile());
          let event = new MouseEvent('click', {bubbles: true});
          this.renderer.invokeElementMethod(
            this.butGetData.nativeElement, 'dispatchEvent', [event]);
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
    this.BookEditForm = JSON.parse(JSON.stringify(el));
    this.modalRef = this.modalService.show(template);
  }

  onDeleteBook(el: any, template: TemplateRef<any>) {
    this.BookEditForm = JSON.parse(JSON.stringify(el));
    this.modalRefDelete = this.modalService.show(template);
  }

  onYes() {
    //var id = this.BookEditForm.id;
    this.deleteData();
  }

  onNo() {
    this.closeModalDelete();
  }

  onSave() {
    if (!this.isnullOrEmpty(this.BookEditForm.volumeInfo.authors[0]) ||
        !this.isnullOrEmpty(this.BookEditForm.volumeInfo.title)) {
      this.isSubmited = true;
    }
    else {
      let updateItem = this.books.find(x => x.id == this.BookEditForm.id);
      let index = this.books.indexOf(updateItem);
      this.books[index] = this.BookEditForm;

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

  private closeModalDelete() {
    this.modalRefDelete.hide();
    this.modalRefDelete = null;
  }
}