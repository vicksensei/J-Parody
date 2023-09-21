import { TriviaData } from './../ngrx-classes/triviadata.service';
import { Action, createAction, createReducer, createSelector, on, props } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, map, catchError, concatMap } from "rxjs";
import { AppState } from "./states";
import { Injectable } from "@angular/core";
import { ITriviaQuestion } from '../ngrx-classes/ITriviaQuestion';


// ** Actions ******************************************************************
export const requestRandomQuestion = createAction('[TRIVIA] Request Random Question');
export const receiveRandomQuestion = createAction('[TRIVIA] Receive Random Question',
props<{questionProp: ITriviaQuestion[]}> ());

// ** Reducers ******************************************************************

export function TriviaDataReducer(state: TriviaDataState | undefined, action: Action) {
    return triviaDataReducer(state, action);
}

export interface TriviaDataState {
    questions: ITriviaQuestion[];    
}

export const initialState: TriviaDataState = {
    questions: []
}

export const triviaDataReducer= createReducer<TriviaDataState>(
    initialState,
    on(receiveRandomQuestion, 
        (state, {questionProp}) : TriviaDataState => ({ ...state, questions : questionProp})   
        ) 
    );
// ** Selectors ******************************************************************
export const selectGlobalState = (state: AppState) => state;

export const selectQuestion = createSelector(
    selectGlobalState,
    state => state.triviaData.questions
);


// ** Effects ******************************************************************

@Injectable()
export class TriviaDataEffects {
    
    constructor(
        private readonly actions$: Actions,
        private triviaHTTPService: TriviaData,
    ) {}

    requestRandomQuestion$ = createEffect(()=> 
        this.actions$.pipe(
            ofType(requestRandomQuestion),
            concatMap(() => 
                this.triviaHTTPService.getRandomTriviaItem$()
            ),
            
            map((questionProp) => {
                const returnValue: any = parseQuestionsArray(questionProp) ;
                return receiveRandomQuestion({questionProp:returnValue});
                
            })
        )
    );
}
// helpers
function parseQuestionsArray(arr:any):ITriviaQuestion[]{
    const returnValue:ITriviaQuestion[] = [];
    arr.forEach( (item:any) => {
        const newItem = {

            category: {
                title: item.category.title,
                id:item.category.id,
                clues_count: item.category.clues_count,
            },
            value: item.value,
            question: item.question,
            answer: item.answer,
            id: item.id,
            showItem:  1

        } as ITriviaQuestion;

    returnValue.push(newItem);
    });
    return returnValue;
}