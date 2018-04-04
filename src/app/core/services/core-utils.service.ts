import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';


import * as THREE from "three";
@Injectable()
export class CoreUtilsService {
  
  // This is used for transferring data between components.  Add a component specific
  // key, so you don't conflict with other components in case they're using this too.
  dataStore : {}

  constructor(
    private http: HttpClient, 
  ) { 
    this.dataStore = {}
  }

  getExampleObservable(apiURL: string) {
    try {
      return this.http.get(apiURL, {})
        .map(res => {
          let result = res;

          return result;
        });
    }
    catch(e) {
      console.log(`try-catch-1: e=${e}`);
    }
  }

}
