// Just a basic angular-side wrapper class for a row in the
// vrize-server table 'lift-reqs'
export class LiftReq {
  id: number;
  example_id : number;

  
  constructor(id, example_id) {
    this.id = id;
    this.example_id = example_id;

  }
}
