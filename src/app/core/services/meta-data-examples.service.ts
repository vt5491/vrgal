import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class MetaDataExamplesService {
  server : URL;

  constructor(private http: HttpClient) { 
    this.server = new URL('http://localhost:3000');
  }

  getMetaData() {
    this.get('examples/260')
      .subscribe(rsp => {
        console.log(`getMetaData: rsp=${rsp}`);
      })
  }

  get(route: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
  
  let url = `${this.server}${route}`;

  return this.http.get(url, httpOptions)
  }

}
