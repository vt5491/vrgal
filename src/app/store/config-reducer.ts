import { ConfigActions } from './app.actions';

export interface IConfigState {
  // count: number;
  // count2: number;
  bgMusicOn: boolean;
}

export class ConfigReducer {

 public reducer(lastState: IConfigState = {bgMusicOn: true}, action) {
    console.log(`ConfigReducer: action.type=${action.type}`)
  switch(action.type) {
    case ConfigActions.BG_MUSIC_OFF: return {
      bgMusicOn: false,
    };
    case ConfigActions.BG_MUSIC_ON: return {
      bgMusicOn: true,
    };
    default:
      return lastState;
  }
 }
}
