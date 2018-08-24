import { Injectable, EventEmitter } from '@angular/core';

interface ShareObj {
  [id: string]: any;
}

@Injectable()
export class GlobalDataService {
  shareObj: ShareObj = {};
  
  constructor() {}
}