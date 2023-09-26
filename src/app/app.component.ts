import { Component, OnDestroy, OnInit } from '@angular/core';
import * as triviaDataNGRX from "./state/triviaDataNgrx"
import { AppState } from './state/states';
import { Store } from '@ngrx/store';
import { filter, Subject, takeUntil } from 'rxjs';
import { ITriviaQuestion } from './ngrx-classes/ITriviaQuestion';
//https://jservice.io/api/random

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy{
  private _destroying$ = new Subject<void>();

  public gameObj:ITriviaQuestion[] =[];
  public columnObj: any = [];
  // public columnObj:
  constructor(
    private store: Store<AppState>
  ){
    
  }
  title = 'Trivia Project';
  
  ngOnInit() { 
    // this.getSingleRandomQuestion();
    this.getCategoryQuestions();
    
    this.store.select(triviaDataNGRX.selectCategory).pipe(
      takeUntil(this._destroying$)
    ).subscribe((returnValue)=> {
      console.log("category>>",returnValue); 

      returnValue.forEach(
        (category) => {
          this.store.dispatch(triviaDataNGRX.requestCategoryQuestions( {categoryIDProp:category.id}))
        }
      )

    })
    this.store.select(triviaDataNGRX.selectCategoryQuestions).pipe(
      takeUntil(this._destroying$))
      .subscribe((returnValue) => {
      console.log("columns>>",returnValue );
      this.columnObj = returnValue;
            }      
            )
  }

  
  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }

  getSingleRandomQuestion():void{

    this.store.dispatch(triviaDataNGRX.requestRandomQuestion());
    this.store.select(triviaDataNGRX.selectQuestion).pipe(
      takeUntil(this._destroying$)
    ).subscribe((returnValue)=> {
      console.log(returnValue); 
      this.gameObj = returnValue;
    })
  }

  
  getCategoryQuestions():void{

    this.store.dispatch(triviaDataNGRX.requestCategories());
  }


  onRandomClick(): void{
    this.getSingleRandomQuestion();
  }

  onCategoryClick(): void{
    this.getCategoryQuestions();
    }

  onItemClick(item:ITriviaQuestion, col:any):void {
    const column = this.columnObj.find((i:ITriviaQuestion[]) => i === col);
    const question = column.find((i:ITriviaQuestion) => i === item);
    if(question!== undefined)
{      question.showItem++;}

  }
}
