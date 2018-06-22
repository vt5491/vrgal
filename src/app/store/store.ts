import { Action, combineReducers } from 'redux';
import { CounterActions } from './app.actions';
import { ConfigActions } from './app.actions';
import { CountReducer } from './count-reducer';
import { ConfigReducer } from './config-reducer';

export interface IAppState {
  count: number;
  count2: number;
  // bgMusicOn: boolean;
}

export const INITIAL_STATE: IAppState = {
  count: 0,
  count2: 0,
};
//
// export function rootReducer(lastState: IAppState, action: Action): IAppState {
//   // console.log(`rootReducer: action.value=${(action as any).value}`);
//   switch(action.type) {
//     case CounterActions.INCREMENT: return {
//       count: lastState.count + 1,
//       count2: lastState.count2 + 2
//     };
//     case CounterActions.DECREMENT: return {
//       count: lastState.count - 1,
//       count2: lastState.count2 - 2,
//     };
//     case CounterActions.SET: {
//       // debugger;
//       return {
//         count: (action as any).val,
//         count2: (action as any).val
//        };
//     }
//   }
//
//   // We don't care about any other actions right now.
//   return lastState;
// }

let cr = new CountReducer();
let cr1 = cr.reducer;
// debugger;
let configReducer = new ConfigReducer();
let config = configReducer.reducer;
let rootReducer = combineReducers({
// export default function rootReducer= combineReducers({
// export default rootReducer = combineReducers({
  // countReducer : countReducer,
  cr1,
  config,
  // config : configReducer
})

// export rootReducer;
export {rootReducer};
// export function rootReducer;
