import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { LiftComponent } from './vrize/components/lift/lift.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private _router: Router) {
    // debugger;
    if (!environment.production) {
      console.log(`router.config.length pre=${this._router.config.length}`);

      this._router.config.push({
        path: 'vrize/lift',
        component: LiftComponent
      });
      console.log(`router.config.length post=${this._router.config.length}`);
    }
  }
}
