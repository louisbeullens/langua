import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators/map';
import {catchError} from 'rxjs/operators/catchError';
import {of} from 'rxjs/observable/of';

import {Settings} from './settings';
import {tap} from 'rxjs/operators';

interface AccessToken {
    id: string;
    ttl: number;
    created: string;
    userId: number;
}

@Injectable()
export class MemberService {
    @Output() currentLanguageIdChanged = new EventEmitter<number>();
    private settings = Settings;
    private accessToken: string;
    private userId: number;
    private firstName: string;
    private lastName: string;
    private choosenLanguage = 1;

    constructor(private http: HttpClient) {
    }

    Login(username: string, password: string): Observable<AccessToken> {
        const user = {
            email: username,
            password: password
        };

        return this.http.post<AccessToken>(this.settings.host + '/api/Members/login', user).pipe(
            tap(tokenObject => {
                this.accessToken = tokenObject.id;
                this.userId = tokenObject.userId;
            })
        );
    }

    getMemberInfo(): Observable<any> {

        // TODO: onderstaande url per funcie genereren dat access_token er automatisch bij komt.

        return this.http.get(this.settings.host + '/api/Members/' + this.userId.toString() + '?access_token=' + this.accessToken).pipe(
            tap(memberInfo => {
                this.firstName = memberInfo.firstname;
                this.lastName = memberInfo.lastname;
            })
        );
    }

    getCurrentLanguageId(): number {
        return this.choosenLanguage;
    }

    changeCurrentLanguageId(languageId): void {
        this.choosenLanguage = languageId;
        this.currentLanguageIdChanged.emit(languageId);
    }
}
