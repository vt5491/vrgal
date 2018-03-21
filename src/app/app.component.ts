import { Component } from '@angular/core';
import { Router, LoadChildren } from '@angular/router';
import { VrizeModule } from './vrize/vrize.module';
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
        path: 'vrize',
        // path: '',
        // see https://stackoverflow.com/questions/39932969/angular2-lazy-loading-module-error-cannot-find-module
        // loadChildren: 'app/vrize/vrize.module#VrizeModule',
        // loadChildren: 'app/vrize/vrize.module',
        // loadChildren: './app/vrize/vrize.module',
        // this works, but not with aot.  The paths don't work in dev mode or
        // non-aot this works good enough for development.  When I get to aot
        // building then I'll have to deal with this problem anew. Actually, I
        // won't, since an aot build will be a '--prod' build, which should
        // *not* include this module.  Thus, in a production build, this path
        // and module won't be driven and/or loaded.  The fact that it fails in
        // production is actually just another form of security blocking anyone
        // from using it (but in a bad way though e.g security through
        // obscurity)
        loadChildren: () => VrizeModule
      })
      // this._router.config.push({
      //   path: 'vrize/lift',
      //   component: LiftComponent
      // });
      console.log(`router.config.length post=${this._router.config.length}`);
    }
  }
}
