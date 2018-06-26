import { CounterActions } from './app.actions';

export interface ICountState {
  count: number;
  count2: number;
  // bgMusicOn: boolean;
}

export const COUNT_STATE_INITIAL: ICountState = {
  count: 0,
  count2: 0,
}

export class CountReducer {
// export default function countReducer(lastState: ICountState, action) {
// let countReducer = function (lastState: ICountState, action) {
 // countReducer = function (lastState: ICountState, action) {
 // public static reducer(lastState: ICountState, action) {
 public reducer(lastState: ICountState = {count: 0, count2: 0}, action) {
 // public reducer(lastState = {'count': 0, 'count2': 0}, action) {
 // public reducer(lastState: ICountState = {}, action) {
// export CountReducer(lastState: ICountState, action) {
  // switch (action.type) {
  //   case 'INCREMENT':
  //     return state + 1
  //   case 'DECREMENT':
  //     return state - 1
  //   default:
  //     return state
  // }
    console.log(`action.type=${action.type}, lastState.count=${lastState.count}`);
  switch(action.type) {
    case CounterActions.INCREMENT: return {
      count: lastState.count + 1,
      count2: lastState.count2 + 2
    };
    case CounterActions.DECREMENT: return {
      count: lastState.count - 1,
      count2: lastState.count2 - 2,
    };
    case CounterActions.SET: {
      // debugger;
      return {
        count: (action as any).val,
        count2: (action as any).val
       };
    }
    default:
      return lastState;
  }

  // We don't care about any other actions right now.
  // return lastState;
}

// export default countReducer;
// export {countReducer};
}
