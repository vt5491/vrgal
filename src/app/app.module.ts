import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
// import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store';

// redux
import { rootReducer, IAppState, INITIAL_STATE } from './store/store';
import { combineReducers } from 'redux';
// import { countReducer } from './store/count-reducer';
import { ICountState } from './store/count-reducer';
import { CounterActions } from './store/app.actions';

// user modules
import { AppComponent } from './app.component';
import { VrGalleryModule } from './vr-gallery/vr-gallery.module';
import { SharedModule } from './shared/shared.module';
import { VrgalMainModule } from './vrgal-main/vrgal-main.module';
// import { VrizeModule } from './vrize/vrize.module';
// components
import { AframeCubeComponent } from './vr-gallery/components/aframe-cube/aframe-cube.component';
import { LinkSelectComponent } from './vr-gallery/components/link-select/link-select.component';
import { QuerySelectComponent } from './vr-gallery/components/query-select/query-select.component';
import { ResultsSceneComponent } from './vr-gallery/components/results-scene/results-scene.component';
import { DataExampleComponent } from './shared/components/data-example/data-example.component';
// componets vrgal-main
import { MainComponent } from './vrgal-main/components/main/main.component';
import { QuerySubComponent } from './vrgal-main/components/query-sub/query-sub.component';
import { ResultSubComponent } from './vrgal-main/components/result-sub/result-sub.component';
// services
import { CoreDataExampleService } from './core/services/core-data-example.service';

const appRoutes:Routes = [
  {path: '', component: AframeCubeComponent},
  {path: 'vr-gallery/link-select', component: LinkSelectComponent},
  {path: 'vr-gallery/query-select', component: QuerySelectComponent},
  {path: 'vr-gallery/results-scene', component: ResultsSceneComponent},
  {path: 'data-example/:id', component: DataExampleComponent},
  {path: 'vrgal/main', component: MainComponent},
 ]

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    VrGalleryModule,
    // VrizeModule,
    SharedModule,
    NgReduxModule,
  ],
  providers: [
    CoreDataExampleService,
    CounterActions,
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {
  constructor(
    private ngRedux: NgRedux<IAppState>,
    // private ngRedux: NgRedux<ICountState>,
    // private ngRedux: NgRedux<any>,
    private devTools: DevToolsExtension
  ) {
    let enhancers = [];

    if (!environment.production && devTools.isEnabled()) {
      enhancers = [ ...enhancers, devTools.enhancer() ];
    }
    // Tell @angular-redux/store about our rootReducer and our initial state.
    // It will use this to create a redux store for us and wire up all the
    // events.
    ngRedux.configureStore(
      rootReducer,
      INITIAL_STATE,
      [],
      enhancers );
    // ngRedux.configureStore(
    //   combineReducers(countReducer),
    //   INITIAL_STATE,
    //   [],
    //   enhancers );
  }
}
