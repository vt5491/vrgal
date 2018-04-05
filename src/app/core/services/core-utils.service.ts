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

  // don't use this for two reasons:
  // 1) a method to read examples belongs in 'examples.service'
  // 2) It introduces a dependency on the express server (port 3002).  
  // Get request can be performed by the NG spa itself, and does not require
  // a node server (only posts, puts, and patches do)
  // getExampleObservable(apiURL: string) {
  //   try {
  //     return this.http.get(apiURL, {})
  //       .map(res => {
  //         let result = res;

  //         return result;
  //       });
  //   }
  //   catch(e) {
  //     console.log(`try-catch-1: e=${e}`);
  //   }
  // }

  getLiftedExample(fp: string) {

  }

}
