import { ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store"
import * as triviaDataNGRX from "./triviaDataNgrx"


export interface AppState{

  triviaData: triviaDataNGRX.TriviaDataState
}

export const reducers:ActionReducerMap<AppState> = {

  triviaData:triviaDataNGRX.TriviaDataReducer
}


export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = true ? [logger] : [];