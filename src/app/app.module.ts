import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
// import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store';
// note: 'redux-persist' has a dependency on react, so we can't use in an ng evironment
// import {persistStore, persistReducer} from 'redux-persist';
// import {persistState} from 'redux-sessionstorage'
import { persistState } from 'redux-localstorage'
import { createStore, compose } from 'redux';

// redux
import { rootReducer, IAppState, INITIAL_STATE } from './store/store';
import { combineReducers } from 'redux';
// import { countReducer } from './store/count-reducer';
import { ICountState } from './store/count-reducer';
import { CounterActions, RuntimeActions } from './store/app.actions';

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
import { CoreBaseService } from './core/services/core-base.service';

const appRoutes:Routes = [
  {path: '', component: AframeCubeComponent},
  {path: 'vr-gallery/link-select', component: LinkSelectComponent},
  {path: 'vr-gallery/query-select', component: QuerySelectComponent},
  {path: 'vr-gallery/results-scene', component: ResultsSceneComponent},
  {path: 'data-example/:id', component: DataExampleComponent},
  {path: 'vrgal/main', component: MainComponent},
 ]

//       const enhancer3 : any = compose(
//         persistState()
//       )
// debugger;
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
    RuntimeActions,
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {
  // ps = persistState;
  constructor(
    private ngRedux: NgRedux<IAppState>,
    // private ngRedux: NgRedux<ICountState>,
    // private ngRedux: NgRedux<any>,
    private devTools: DevToolsExtension,
    // private ps : persistState,
  ) {
    let enhancers = [];

    if (!environment.production && devTools.isEnabled()) {
      enhancers = [ ...enhancers, devTools.enhancer() ];
    }
    // persist-redux stuff
    // const persistConfig : any = {
    //   key: 'root',
    //   storage: 'sessionStorage'
    // }
    // const persistedReducer : any = persistReducer(persistConfig, rootReducer)
    // let persistStore : any = createStore(persistedReducer)
    // ngRedux.provideStore(persistStore);
    // let persistStore = ngRedux.provideStore(persistedReducer)
    // end persist-redux
    // redux-sessionstorage start
    // const createPersistentStore = compose(
    //   persistState(/*paths, config*/)
    // )(createStore)
//     const enhancer = compose(
//   /* [middlewares] */,
//   persistState(/*paths, config*/),
// )
//
// const store = createStore(/*reducer, [initialState]*/, enhancer)
      // enhancers = [ ...enhancers, persistState() ];
      // enhancers.push(persistState());
      // debugger;
      // const enhancer2 : any = compose(
      // )

    // redux-sessionstorage end
    // let initState :any = sessionStorage.getItem('vtstate') || INITIAL_STATE;
    let initState = INITIAL_STATE;

    if(sessionStorage.getItem(`${CoreBaseService.appPrefix}_appState`)) {
      initState = JSON.parse(sessionStorage.getItem(`${CoreBaseService.appPrefix}_appState`));
    }
    // debugger;
    // if (initState.cr1) {
    //   console.log(`AppModule: initstate.count2 = ${initState.cr1.count2}`)
    // }
    // console.log(`AppModule: CoreBaseService.appPrefixClass = ${CoreBaseService.appPrefix}`);

    // Tell @angular-redux/store about our rootReducer and our initial state.
    // It will use this to create a redux store for us and wire up all the
    // events.
    ngRedux.configureStore(
      // rootReducer as <IAppState, any>,
      rootReducer as any,
      // INITIAL_STATE,
      initState,
      // [],
      enhancers
      // enhancer3
    );
  }
}
