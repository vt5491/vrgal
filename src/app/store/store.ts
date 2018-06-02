import { Action } from 'redux';
import { CounterActions } from './app.actions';

export interface IAppState {
  count: number;
  count2: number;
}

export const INITIAL_STATE: IAppState = {
  count: 0,
  count2: 0,
};
//
export function rootReducer(lastState: IAppState, action: Action): IAppState {
  // console.log(`rootReducer: action.value=${(action as any).value}`);
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
  }

  // We don't care about any other actions right now.
  return lastState;
}
