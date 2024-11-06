import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class SearchService{


    private searchSubject = new Subject<String>();


    onSearchValue(search: string) {
        this.searchSubject.next(search);
    }

    getSearchValueObservable() {
        return this.searchSubject.asObservable();
    }



}