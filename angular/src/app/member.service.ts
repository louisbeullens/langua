import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {tap} from 'rxjs/operators';
import {ApiService} from './api.service';
import {Subject} from 'rxjs/Subject';
import {Member, AccessToken, Language} from './interfaces';

@Injectable()
export class MemberService {
    public currentLanguageIdChanged = new Subject<number>();
    private memberId: number = null;
    private choosenLanguage = 2;
    private nativeLanguage = 4;
    private trainingLanguage = 2;
    private roles: string[] = null;

    constructor(private api: ApiService) {
    }

    login(email: string, password: string): Observable<AccessToken> {
        return this.api.post<AccessToken>('/Members/login', {email: email, password: password}).pipe(
            tap( tokenObject => {
                this.api.setAccessToken(tokenObject.id);
                this.memberId = tokenObject.userId;
                this.api.get<string[]>('/Members/' + this.memberId + '/roles').subscribe(roles => {
                    this.roles = roles;
                });
            })
        );
    }

    facebookLogin(fb_access_token) {
        return this.api.post<AccessToken>('/Members/facebookLogin', {fb_access_token: fb_access_token}).pipe(
            tap( tokenObject => {
                this.api.setAccessToken(tokenObject.id);
                this.memberId = tokenObject.userId;
                this.api.get<string[]>('/Members/' + this.memberId + '/roles').subscribe(roles => {
                    this.roles = roles;
                });
            })
        );
    }

    register(email: string, firstname: string, lastname: string, password: string) {
        return this.api.post('/Members', {email: email, firstname: firstname, lastname: lastname, password: password});
    }

    emailExists(email: string) {
        return this.api.get('/Members/' + email + '/exists');
    }

    getMemberId(create = true): Promise<number> {
        if (this.memberId || !create) {
            return Promise.resolve(this.memberId);
        } else {
            return new Promise((resolve, reject) => {
                this.api.get<AccessToken>('/Members/anonymousLogin').subscribe(accessToken => {
                    this.memberId = accessToken.userId;
                    this.api.setAccessToken(accessToken.id);
                    resolve(this.memberId);
                }, err => reject(err));
            });
        }
    }

    getMemberIdSync(): number {
        return this.memberId;
    }

    getMemberInfo(): Promise<Member> {
        if (this.memberId) {
            return new Promise((resolve, reject) => {
                this.api.get<Member>('/Members/' + this.memberId.toString()).subscribe(member => {
                    resolve(member);
                }, err => reject(err));
            });
        } else {
            return Promise.resolve({id: null, email: null, firstname: null, lastname: null});
        }
    }

    hasRole(role: string): boolean {
        return (this.roles && this.roles.indexOf(role) !== -1) ? true : false;
    }

    getResults(): Promise<any> {
        const memberId = this.getMemberIdSync();
        if (memberId) {
            return new Promise((resolve, reject) => {
                this.api.get('/Members/' + memberId.toString() + '/results').subscribe(results => {
                    resolve(results);
                }, err => {
                    console.log('getResults error',err);
                    reject(err);
                });
            });
        } else {
            return Promise.reject('member is not logged in.');
        }
    }

    resetResults() {
        return this.api.get('/Members/' + this.memberId + '/resetResults');
    }

    getCurrentLanguageId(): number {
        return this.choosenLanguage;
    }

    getNativeLanguageId(): number {
        return this.nativeLanguage;
    }

    getTrainingLanguageId(): number {
        return this.trainingLanguage;
    }

    getTrainingLanguages(): Observable<Language[]> {
        return this.api.get<Language[]>('/Languages');
    }

    setCurrentLanguageId(languageId): void {
        this.choosenLanguage = languageId;
        this.currentLanguageIdChanged.next(languageId);
    }
}
