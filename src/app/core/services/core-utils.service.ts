import { Injectable } from '@angular/core';

@Injectable()
export class CoreUtilsService {
  
  // This is used for transferring data between components.  Add a component specific
  // key, so you don't conflict with other components in case they're using this too.
  dataStore : {}

  constructor() { 
    this.dataStore = {}
  }

}
