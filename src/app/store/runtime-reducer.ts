import { RuntimeActions } from './app.actions';

export interface IQueryResult {
  queryType: string,
  data: [any],
}

export interface IRuntimeState {
  lastQuery: IQueryResult;
  lastRoute: string;
}

// export const RUNTIME_STATE_INITIAL: IRuntimeState = {
//   lastQuery: null,
// }
export const RUNTIME_STATE_INITIAL: IRuntimeState = {} as any;
// export const RUNTIME_STATE_INITIAL: IRuntimeState = null;

export class RuntimeReducer {
 public reducer(lastState: IRuntimeState = RUNTIME_STATE_INITIAL , action) {
 // public reducer(lastState: IRuntimeState = {} as any , action) {
 // public reducer(lastState: any = {} as any , action) {
 // public reducer(lastState: IRuntimeState = {lastQuery: null} as any , action) {
 // public reducer(lastState: IRuntimeState = null , action) {
 // public reducer(lastState: IRuntimeState , action) {
    console.log(`RuntimeReducer: action.type=${action.type}`)
  // debugger;
  switch(action.type) {
    case RuntimeActions.SET_LAST_QUERY: return {
      lastQuery: {
        queryType: action.val.queryType,
        data: action.val.data,
      }
    };
    case RuntimeActions.SET_LAST_ROUTE: return {
      // lastRoute: action.val.lastRoute
      lastRoute: action.val
    };
    default:
      return lastState;
  }
 }
}

// export interface IRuntimeState {
//   // count: number;
//   // count2: number;
//   bgMusicOn: boolean;
// }
//
// export const RUNTIME_STATE_INITIAL: IRuntimeState = {
//   bgMusicOn: true,
// }
//
//
// export class RuntimeReducer {
//
//  public reducer(lastState: IRuntimeState = {bgMusicOn: true}, action) {
//     console.log(`RuntimeReducer: action.type=${action.type}`)
//   switch(action.type) {
//     case RuntimeActions.BG_MUSIC_OFF: return {
//       bgMusicOn: false,
//     };
//     case RuntimeActions.BG_MUSIC_ON: return {
//       bgMusicOn: true,
//     };
//     default:
//       return lastState;
//   }
//  }
// }
