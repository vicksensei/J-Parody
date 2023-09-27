import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SecureApiClient } from "../HTTPCore/secure-api-client.service";
import { ITriviaQuestion } from "./ITriviaQuestion";
import { ICategory } from "./ICategory";

@Injectable()
export class TriviaData{
    private _apiAddress= "https://jservice.io/api";

    constructor(private webClient:SecureApiClient) {}
    get5Categories$():Observable<ICategory[]>
    {   
        const maxOffset=28157;
        const rand = Math.floor(Math.random() * maxOffset);
        console.log("Random offset >>", rand);
        console.log('rand >>', rand );
        return this.webClient.get(`${this._apiAddress}/categories?count=20&offset=${rand}`);
    }

    getCluesForCategory$(category: number) {
        return this.webClient.get(`${this._apiAddress}/clues?category=${category}`);
    }
    
    getTriviaItemByID$(triviaId:number){}


    getRandomTriviaItem$():Observable<any[]>{
        return this.webClient.get(`${this._apiAddress}/random?count=5`)
    }
}