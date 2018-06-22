// Note: store is not a module.  I typically put an providers and definitions
// in core.module
import { Injectable } from '@angular/core';
import { Action } from 'redux';

@Injectable()
export class CounterActions {
  static INCREMENT = 'INCREMENT';
  static DECREMENT = 'DECREMENT';
  static SET = 'SET'

  increment(): Action {
    return { type: CounterActions.INCREMENT };
  }

  decrement(): Action {
    return { type: CounterActions.DECREMENT };
  }

  set(val): Action {
    return ({
      type: CounterActions.SET,
      val: val
    } as any);
  }
}

@Injectable()
export class ConfigActions {
  static BG_MUSIC_ON = 'BG_MUSIC_ON';
  static BG_MUSIC_OFF = 'BG_MUSIC_OFF';
  static SET = 'SET'

  bgMusicOn(): Action {
    return { type: ConfigActions.BG_MUSIC_ON };
  }

  bgMusicOff(): Action {
    return { type: ConfigActions.BG_MUSIC_OFF };
  }

  set(val): Action {
    return ({
      type: ConfigActions.SET,
      val: val
    } as any);
  }
}
