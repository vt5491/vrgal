import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { TransformerService } from '../../services/transformer.service';
import { ParserService } from '../../services/parser.service';
import { DataExamplesService } from '../../services/data-examples.service';
import { ExamplesService } from '../../../core/services/examples.service';
import { ExampleComponent } from '../../../shared/components/example/example.component';
import { environment } from '../../../../environments/environment';

import * as _ from 'lodash';

@Component({
  selector: 'app-lift',
  templateUrl: './lift.component.html',
  styleUrls: ['./lift.component.css']
})

export class LiftComponent implements OnInit {
  inputDoc: Document;
  inputString : string;
  outputText: string;
  testFiles : string[];
  testFileIdLookup : {};
  fn : string;
  writeToTmp : boolean;

  constructor(
    private http: HttpClient,
    private transformer: TransformerService,
    private parser: ParserService,
    private dataExamples: DataExamplesService,
    private examples: ExamplesService,
  )
    {
      this.testFiles = [
        'webgl_geometry_cube.html',
        'webgl_geometries.html',
        'webgl_shaders_ocean.html',
        'webgl_shaders_ocean2.html(x)',
        'webgl_mirror.html',
        'simple.html'
      ];

      this.testFileIdLookup = new Object();
      //Note: this lookup is no longer really needed since we let the server
      // come up with the full path name.
      // this.testFileLookup['webgl_geometry_cube.html'] = '../../../../../assets/test/examples/unix_style/webgl_geometry_cube.html';
      // this.testFileLookup['webgl_geometries.html'] = '../../../../../assets/test/examples/unix_style/webgl_geometries.html';
      // this.testFileLookup['webgl_shaders_ocean.html'] = '../../../../../assets/test/examples/unix_style/webgl_shaders_ocean.html';
      // this.testFileLookup['webgl_shaders_ocean2.html(x)'] = '../../../../../assets/test/examples/unix_style/webgl_shaders_ocean2.html';
      // this.testFileLookup['webgl_mirror.html'] = '../../../../../assets/test/examples/unix_style/webgl_mirror.html';

      // this.testFileLookup['webgl_geometry_cube.html'] = '../../../../../assets/threejs-env/examples/webgl_geometry_cube.html';

      // default to the default file in the select dropdown.
      // this.fn = this.testFileLookup['webgl_geometry_cube.html'];
      this.fn = 'webgl_geometry_cube.html';

      this.writeToTmp = !environment.production;
  }

  ngOnInit() {
    this.examples.getExampleIds(this.testFiles)
      .subscribe(rsp => {
        console.log(`getExampleIds: rsp=${rsp}`);
        for( let i=0; i< (rsp as any).length; i++) {
          let id = rsp[i].id;
          let name = rsp[i].name;

          this.testFileIdLookup[name] = id;
        }

        // debugger;
      })
  }

  onSubmit(f: NgForm) {
    console.log(`lift.onSubmit: entered, f.value=${f.controls.inputText.value}`);
    console.log(`f.value=${f.value}`);
    // console.log(`testFile.value=${testFile.value}`);
    // debugger;
    let inputText = f.controls.inputText.value;
    if (inputText) {
      this.lift(inputText);

      this.outputText = _.unescape(
        new XMLSerializer().serializeToString(this.inputDoc));
    }
    else {
      this.dataExamples.get(
        `examples/${this.fn}`, 
        ({responseType : 'text'} as any))
      .subscribe((rsp) => {
        // debugger;
        // console.log(`onSubmit: rsp.data=${rsp.data}`);
        // this.inputString = data;
        this.inputString = (rsp as any).data;
        // console.log(`inputString=${this.inputString}`);
        this.lift(this.inputString);
        // this.outputText = new XMLSerializer().serializeToString(this.inputDoc);
        // Note: we have to call decodeURI to get rid of things like '&lt;' in the
        // javascript (XMLSerializer will escape all the javascript)
        // debugger;
        this.outputText = _.unescape(
          new XMLSerializer().serializeToString(this.inputDoc));
        // console.log(`outputText=${this.outputText}`);
        
        },
        (err: HttpErrorResponse) => {
          console.log('parseHtml: err=' + err, 'httperror=' + err.error);
        },
        () => {
          //TODO: put calls for other files here and put the 'done()' call in the last of the chain
          console.log('webgl_geometries loaded');
        }
      );
    }

    // let fn = '../../assets/test/examples/unix_style/webgl_geometry_cube.html';
    // let fn = '../../assets/test/examples/unix_style/webgl_geometries.html';
    // let fn = '../../assets/test/examples/unix_style/webgl_shaders_ocean.html';

  }

  onChange(fn) {
    console.log(`onChange: fn=${fn}`);
    // this.fn = this.testFileLookup[fn];
    this.fn = fn;
    console.log(`this.fn=${this.fn}`);
  };

  onClick(e) {
    console.log(`onClick: e=${e}`);

  }

  // toggleWriteToTmp(e: Event) {
  toggleWriteToTmp() {
    console.log(`toggleWriteToTmp.pre: this.writeToTmp=${this.writeToTmp}`);
    this.writeToTmp = !(this.writeToTmp);
    console.log(`toggleWriteToTmp.post: this.writeToTmp=${this.writeToTmp}`);

    this.dataExamples.writeToTmp = this.writeToTmp;
  }

  // userlift(e : Event) {
  lift(inputText : string) {
    let inputHtml = inputText;
    //
    let domParser = new DOMParser();

    this.inputDoc = domParser.parseFromString(inputHtml, "text/html");

    this.transformer.liftDoc(this.inputDoc);
  }

  // file has been transformed. Now save it the output directory and update
  // the db to reflect 'lifted' and 'lifted_at'.
  commitExample(e: Event) {
    // form.controls['cb-use-tmp'].value; 
    console.log(`LiftComponent.commitExample: this.writeToTmp=${this.writeToTmp}`); 
    // This is basically just the call to either update an existing file
    // or to create it if doesn't exist.  We leave it to the server to decide
    // which case it is.  Thus, we just do a POST and don't do a POST (create) 
    // vs PUT (update)
    this.dataExamples.post(
      `examples/${this.fn}`, this.outputText  
    )
    .subscribe((rsp) => {
      console.log(`commitExample: rsp=${rsp}`);
      // and let meta-data server know that that example has been lifted.
      let example = new ExampleComponent();

      console.log(`commitExample: this.fn=${this.fn}, fn.id=${this.testFileIdLookup[this.fn]}`);
      
      example.id = this.testFileIdLookup[this.fn];
      // example.id = 260
      // example.name = this.fn;
      // if lifted is already true, rails won't schedule the request. Nice
      // feature, except it doesn't cause 'lifted_at' (and indirectly
      // 'updated_at') to get driven.  So we need to set it to false, and
      // then true to get these to change. 
      // example.lifted = false;
      // // example.lifted = 0;
      // this.examples.setLifted(example);

      example.lifted = true;
      // example.lifted = false;
      // // example.lifted = 1;
      this.examples.setLifted(example);
    })

  }

  createExample(e: Event) {
    this.dataExamples.post(
      'src/assets/threejs-env/examples/abc.html', 
      "Ritchie Blackmore"
    //   {
    //     // headers: new HttpHeaders().set('Content-Type', 'application/json'),
    //     responseType: 'text' 
    //  } 
    )
    .subscribe((rsp) => {
      console.log(`createExample: rsp=${rsp}`);
    })
  }

  getExampleMetaData(e: Event) {
    this.examples.getMetaData();
  }

  // development only
  getExampleIdsDriver() {
    // let files = 
    let files = ['webgl_geometry_cube.html', 'webgl_mirror.html'];

    // let result;
    // result = this.examples.getExampleIds(files);
    this.examples.getExampleIds(files)
      .subscribe(rsp => {
        console.log(`getExampleIds: rsp=${rsp}`);
        
        // debugger;
        // result = rsp;

        // return result;
      })


    // console.log(`getExampleIdsDriver: result=${result}`);
    
  }

}

