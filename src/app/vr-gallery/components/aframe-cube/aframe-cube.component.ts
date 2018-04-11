import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-aframe-cube',
  templateUrl: './aframe-cube.component.html',
  styleUrls: ['./aframe-cube.component.css']
})
export class AframeCubeComponent implements OnInit {

  constructor(private http: HttpClient) { 
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

}
