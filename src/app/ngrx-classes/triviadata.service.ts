import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SecureApiClient } from "../HTTPCore/secure-api-client.service";
import { ITriviaQuestion } from "./ITriviaQuestion";

@Injectable()
export class TriviaData{
    private _apiAddress= "https://jservice.io/api";

    constructor(private webClient:SecureApiClient) {}
    get5Categories$(){this.webClient.get(`${this._apiAddress}/categories?count=5`)}
    // getCluesForCategories(categories: )
    getTriviaItemByID$(triviaId:number){}
    getRandomTriviaItem$():Observable<any[]>{
        return this.webClient.get(`${this._apiAddress}/random?count=5`)
    }
}