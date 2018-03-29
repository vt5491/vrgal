import { Injectable } from '@angular/core';

@Injectable()
export class CoreBaseService {

  // scruz
  // vrizeSvcUrl = "http://192.168.1.147:3000"
  // svale
  // vrizeSvcUrl = "http://192.168.50.158:3000"
  // generic.. ok as long as everything is running on the same host machine
  vrizeSvcUrl = "http://localhost:3000"
  appPrefix = "vrgal"

  constructor() { 

  }

  doIt() {
    return 7;
  }

}
