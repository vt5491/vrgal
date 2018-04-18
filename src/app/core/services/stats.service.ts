import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { CoreBaseService } from './core-base.service';

@Injectable()
export class StatsService {

  server: URL;

  constructor(
    private http: HttpClient,
    private base : CoreBaseService,
  ) { 
    this.server = new URL(base.vrizeSvcUrl);
  }

  put(route: string, stat: Object) {
    let url = `${this.server}${route}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    }
    // Note: it appears the put request automatically "json-ifies" the object.
    // So if you json-ify it here, you get double-json (lots of escaped quotes)
    // and it *won't* get parsed correctly by rails. e.g don't do this.
    const statJson = JSON.stringify(stat);
    const headers: Headers = new Headers();
    // headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('Content-Type', 'application/json');

    // return this.http.put(url, statJson, headers)
    return this.http.put(url, stat, httpOptions)
    // .pipe(
    //   // catchError(this.handleError('getHeroes', []))
    //   catchError(this.handleError('abc', []))
    //   // catchError(err => {console.log(`StatsService.post: error=${err}`)}, [])
    // )
  }

  // handleError(err, []) {

  // }
  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {

  //     // TODO: send the error to remote logging infrastructure
  //     console.error(error); // log to console instead

  //     // TODO: better job of transforming error for user consumption
  //     this.log(`${operation} failed: ${error.message}`);

  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }

}
