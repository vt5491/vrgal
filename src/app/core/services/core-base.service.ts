import { Injectable } from '@angular/core';

@Injectable()
export class CoreBaseService {

  // scruz
  // vrizeSvcUrl = "http://192.168.1.147:3000"
  // svale
  vrizeSvcUrl = "http://192.168.50.158:3000"
  // generic.. ok as long as everything is running on the same host machine
  // actually, ok for the admin part, but vr-gallery/query-select needs a
  // remote server (server is not running on same ip as the SPA)
  // vrizeSvcUrl = "http://localhost:3000"
  appPrefix = "vrgal"
  liftPrefix = "vrize-";
  examplesPath = 'assets/threejs-env/examples';

  constructor() { 

  }

  doIt() {
    return 7;
  }

}
