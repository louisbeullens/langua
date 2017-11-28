import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {tap} from 'rxjs/operators';
import {ApiService} from "./api.service";
import {Subject} from "rxjs/Subject";

interface AccessToken {
    id: string;
    ttl: number;
    created: string;
    userId: number;
}

@Injectable()
export class MemberService {
    public currentLanguageIdChanged = new Subject<number>();
    private userId: number;
    private choosenLanguage = 1;

    constructor(private http: ApiService) {
    }

    login(email: string, password: string): Observable<AccessToken> {
        return this.http.post<AccessToken>('/Members/login', {email: email, password: password}).pipe(
            tap(tokenObject => {
                this.http.setAccessToken(tokenObject.id);
                this.userId = tokenObject.userId;
            })
        );
    }

    emailExists(email: string) {
        return this.http.get('/Members/' + email + '/exists');
    }

    getCurrentLanguageId(): number {
        return this.choosenLanguage;
    }

    changeCurrentLanguageId(languageId): void {
        this.choosenLanguage = languageId;
        this.currentLanguageIdChanged.next(languageId);
    }
}
