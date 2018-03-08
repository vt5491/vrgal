import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ExamplesService {
  server : URL;

  constructor(private http: HttpClient) {
    this.server = new URL('http://localhost:3000');

  }

  get(fn: string, text: string) {
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'text/plain',
        // 'Access-Control-Allow-Origin': 'http://localhost:5200'
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        // 'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
      })
    };

    // let url = `${this.server}/${fn}`;
    let url = `${this.server}`;
    console.log(`ExampleService.get: url=${url}`);


    return this.http
      .get(url,  httpOptions )
      // .put(url,)
      // .map(res => res.text());
  }

  // Update existing Hero
  put(fn: string, text: string) {
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'text/plain',
        // 'Access-Control-Allow-Origin': 'http://localhost:5200'
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        // 'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
      })
    };

    // let url = `${this.server}/${fn}`;
    let url = `${this.server}`;
    console.log(`ExampleService.put: url=${url}`);

    // let postObj = { fn : text};
    let postObj = new Object();
    postObj[fn] = text;


    return this.http
      // .put(url, JSON.stringify(fn), httpOptions )
      .put(url, postObj, httpOptions )
      // .map(res => res.text());
  }



}
