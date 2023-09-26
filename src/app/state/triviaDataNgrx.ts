import { ICategory } from './../ngrx-classes/ICategory';
import { TriviaData } from './../ngrx-classes/triviadata.service';
import { Action, createAction, createReducer, createSelector, on, props } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, map, catchError, concatMap } from "rxjs";
import { AppState } from "./states";
import { Injectable } from "@angular/core";
import { ITriviaQuestion } from '../ngrx-classes/ITriviaQuestion';

// ** Actions ******************************************************************

/**
 * Initial attempt at creating requests for trivia items, sends and receives a reuquest that 
 * returns X random trivia questions of random categories. 
 * responce brings an array of questions.
 * currently used for initialization.
 */
export const requestRandomQuestion = createAction('[TRIVIA] Request Random Question');
export const receiveRandomQuestion = createAction('[TRIVIA] Receive Random Question',
props<{questionProp: ITriviaQuestion[]}> ());


/**
 * Sends a request for 5 random valid categories to the API. 
 * IcategoryItems include an ID, a Title and a count. 
 * the ID is all we care about.
 */
export const requestCategories = createAction('[TRIVIA] Request Category Item');
export const receiveCategories = createAction('[TRIVIA] Receive Category Item',
props<{categoryProp: ICategory[]}> ());

/**
 * Intended to send a request that for a specific category that responds with an 
 * array of questions.
 * TODO find out why it's not working
 */
export const requestCategoryQuestions = createAction('[TRIVIA] Request Category Question', 
props<{categoryIDProp: number }>());
export const receiveCategoryQuestions = createAction('[TRIVIA] Receive Category Question',
props<{questionProp: ITriviaQuestion[]}> ());

// ** Reducers ******************************************************************

export function TriviaDataReducer(state: TriviaDataState | undefined, action: Action) {
    return triviaDataReducer(state, action);
}

//create the state model
export interface TriviaDataState {
    questions: ITriviaQuestion[]; // This is for Random questions only
    categories:  ICategory[];   // for the five categories we will use in the game
    columns: any[]; // The questions/answers for each of the five categories
}

//initialize the state
export const initialState: TriviaDataState = {
    questions: [],
    categories: [],
    columns: []
}


export const triviaDataReducer= createReducer<TriviaDataState>(
    initialState,
    on(receiveRandomQuestion, 
        (state, {questionProp}) : TriviaDataState => ({ ...state, questions : questionProp})   
        ),
    
    on(receiveCategories,
            (state, {categoryProp}) :TriviaDataState => {
                const tempState:any = {...state};
                console.log("categoryProp :>>", categoryProp);
                tempState.categories = categoryProp;          
                return tempState;
            } )
        ,
    on(receiveCategoryQuestions, 
        (state, {questionProp}) : TriviaDataState => 
        {
            console.log("InitialState :>>", initialState)
            const tempState:any = { ...state };
            tempState.columns.push(questionProp.sort((a,b)=> a.value - b.value));
            return (tempState);
        }   
        ) 
    );
// ** Selectors ******************************************************************
export const selectGlobalState = (state: AppState) => state;

export const selectQuestion = createSelector(
    selectGlobalState,
    state => state.triviaData.questions
);

export const selectCategory = createSelector(
    selectGlobalState,
    state => state.triviaData.categories
);


export const selectCategoryQuestions = createSelector(
    selectGlobalState,
    state => state.triviaData.columns
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
        
    requestCategories$ = createEffect(()=> 
    this.actions$.pipe(
        ofType(requestCategories),
        concatMap(() => 
            this.triviaHTTPService.get5Categories$()
                  ),
        map( (categoryProp) => receiveCategories({categoryProp:categoryProp}) )
        )
    );

    requestCategoryQuestions$ = createEffect(()=> 
    this.actions$.pipe(
        ofType(requestCategoryQuestions),
        concatMap((categoryIDProp) =>  //it seems like it is necessary for primitives to either be mapped as an object or referenced as an object in njrx
            this.triviaHTTPService.getCluesForCategory$( categoryIDProp.categoryIDProp) //we opted to reference it as an object here.
        ),
        
        map((questionProp) => {
            const returnValue: any = parseQuestionsArray(questionProp) ;
            return receiveCategoryQuestions({questionProp:returnValue});
            
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