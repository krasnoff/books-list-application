import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import {AppService} from './app.service';
import {Subscription} from 'rxjs';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppService]
})
export class AppComponent implements OnInit, OnDestroy {
  books: Array<any>;
  subscription: Subscription = null;
  modalElement: any;
  modalRef: BsModalRef;

  public isSubmited = false;

  BookEditForm = {
    Id: "",
    BookTitle: "",
    AuthorsName: "",
    PublishedDate: ""
  }

  constructor(private _httpService:AppService, private modalService: BsModalService) {}

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
