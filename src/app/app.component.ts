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
  constructor(
    private store: Store<AppState>,
  ){
    
  }
  title = 'Trivia Project';
  
  ngOnInit() { 
    this.getSingleRandomQuestion();
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


  onClick(): void{
this. getSingleRandomQuestion()
  }
  onItemClick(item:ITriviaQuestion):void {
    const question = this.gameObj.find((i) => i === item);
    if(question!== undefined)
{      question.showItem++;}

  }
}
