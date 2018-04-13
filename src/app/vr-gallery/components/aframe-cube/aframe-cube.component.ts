import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders, HttpParams } from '@angular/common/http';

import { ExamplesService } from '../../../core/services/examples.service';
import { StatsService } from '../../../core/services/stats.service';

@Component({
  selector: 'app-aframe-cube',
  templateUrl: './aframe-cube.component.html',
  styleUrls: ['./aframe-cube.component.css']
})
export class AframeCubeComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private examples: ExamplesService,
    private stats: StatsService,
  ) { 
    console.log(`AframeCubeComponent.ctor: entered`);
    // debugger;
  }

  ngOnInit() {
    console.log(`hi from AframeCubeComponent`);
    // let httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'text/plain',
    //   })
    // };
    let httpOptions = {responseType: 'text'};
    // let httpOptions = {};
    let fn = "assets/abc.txt";
    // let fn = "assets/abc.json";
    // let fn = 'http://localhost:4200/assets/threejs-env/examples/vrize-webgl_mirror.html';
    // let fn = 'assets/threejs-env/examples/vrize-webgl_mirror.html';
    // this.http.get(fn, httpOptions).subscribe(rsp => {
    // debugger;
    // this.http.get("assets/abc.json", httpOptions).subscribe(
    //   rsp => {
    //     debugger;
    //     console.log(`rsp=${rsp}`);
    //   },
    //   err => console.log(err), 
    // )

    // this.http.get(fn, {responseType: 'text'}).subscribe(data => {
    //   console.log(`data=${data}`);
    //   debugger;
    // },
    // err => {
    //   console.log(`err=${err}`);
    //   debugger;
    // });
  }

  writeToStats(evt) {
    console.log(`AframeCubeComponent.writeToStats: entered`);

    // return this.http.put<Hero>(this.heroesUrl, hero, httpOptions)
    // .pipe(
    //   catchError(this.handleError('updateHero', hero))
    // );
    // return this.http.put<Hero>(this.heroesUrl, hero, httpOptions)
    // .pipe(
    //   catchError(this.handleError('updateHero', hero))
    // );
    let stat =  { 'likes': 2};
    // let stat = {'stat' : {'example_id' : 260, 'likes': 2}};

    this.stats.put('stats/1', stat)
      .subscribe(
        rsp => {console.log(`AframeCubeComoponent.writeToStats: rsp=${rsp}`)},
        err => {console.log(`AframeCubeComoponent.writeToStats: err=${err.message}`)}
      );

  }

}
