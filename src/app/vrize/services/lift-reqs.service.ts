//  Created: 2018-03-20
// Angular interface to the Rails model 'liftReqs' (table lift_reqs).
// This table represents examples that are scheduled to be lifted.

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { CoreBaseService } from '../../core/services/core-base.service';

@Injectable()
export class LiftReqsService {
  server : URL;

  constructor(
    private base : CoreBaseService,
    private http: HttpClient
  ) { 
    // this.server = new document.URL(this.base.vrizeSvcUrl) as any;
    this.server = new URL(this.base.vrizeSvcUrl);
    // this.server = new URL();
    // this.server.href = this.base.vrizeSvcUrl;
  }

  // get all lift requests in the lift_reqs table
  // getIndex(route: string) {
  getIndex() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
  
    // the url is the root component
    let url = `${this.server}/lift_reqs.json`;
    console.log(`LiftReqsService.get: url=${url}`);


    return this.http.get(url, httpOptions)

  }

}
