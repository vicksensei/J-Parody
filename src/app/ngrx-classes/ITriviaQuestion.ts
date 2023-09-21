
export interface ITriviaQuestion{
    category: {
        title: string;
        id:number;
        clues_count: number;
    };
    value:number; 
    question:string;
    answer:string;
    id:number;
    showItem: number;
}