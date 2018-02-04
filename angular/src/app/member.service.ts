import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {tap, map} from 'rxjs/operators';
import {ApiService} from './api.service';
import {Subject} from 'rxjs/Subject';
import {Member, AccessToken, Language} from './interfaces';
import { HttpClient } from '@angular/common/http';

declare var window;

@Injectable()
export class MemberService {
    public currentLanguageIdChanged = new Subject<number>();
    public recaptchaResponseReceived = new Subject<string>();
    private memberId: number = null;
    private memberInfo: any = null;
    private choosenLanguage = 2;
    private nativeLanguage = 4;
    private trainingLanguage = 2;
    private roles: string[] = null;
    private registered = false;

    constructor(private api: ApiService) {
        window.grecaptchaResponseReceived = this.recaptchaResponseReceived;
    }

    getReCaptchaResponse() {
        return new Promise((resolve, reject) => {
            if (window.grecaptcha) {
                const unsubscriber = this.recaptchaResponseReceived.subscribe(response => {
                    unsubscriber.unsubscribe();
                    window.grecaptcha.reset();
                    return resolve(response);
                });
                window.grecaptcha.execute();
                setTimeout(_ => {
                    unsubscriber.unsubscribe();
                    reject('timeout');
                }, 60000);
            } else {
                return reject('recaptcha not available');
            }
        });
    }

    requestPasswordReset(email: string) {
        return this.api.post<any>('/Members/reset',{email: email});
    }

    login(email: string, password: string): Observable<AccessToken> {
        return this.api.post<AccessToken>('/Members/login', {email: email, password: password}).pipe(
            tap( tokenObject => {
                // TODO: login handler maken;
                this.api.setAccessToken(tokenObject.id);
                this.memberId = tokenObject.userId;
                this.getMemberInfo().subscribe(info => this.registered = true);
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
                this.getMemberInfo().subscribe(info => this.registered = true);
                this.api.get<string[]>('/Members/' + this.memberId + '/roles').subscribe(roles => {
                    this.roles = roles;
                });
            })
        );
    }

    logout() {
        this.api.clearAccessToken();
        this.memberId = null;
        this.memberInfo = null;
        this.roles = null;
        this.registered = false;
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

    getMemberInfo() {
        return this.api.get<Member>('/Members/' + this.memberId.toString()).pipe(tap(info => this.memberInfo = info));
    }

    getMemberName() {
        let firstname = this.memberInfo.firstname[0].toUpperCase() + this.memberInfo.firstname.slice(1);
        let lastname = this.memberInfo.lastname[0].toUpperCase() + this.memberInfo.lastname.slice(1);
        return firstname + ' ' + lastname;
    }

    hasRole(role: string): boolean {
        return (this.roles && this.roles.indexOf(role) !== -1) ? true : false;
    }

    isRegistered() {
        return this.registered;
    }

    getResults(): Promise<any> {
        const memberId = this.getMemberIdSync();
        if (memberId) {
            return new Promise((resolve, reject) => {
                this.api.get('/Members/' + memberId.toString() + '/results').subscribe(results => {
                    resolve(results);
                }, err => {
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
        return this.api.get<Language[]>('/Languages').pipe(map(languages => {
            return languages.filter(value => {
                return (value.id !== 3);
            });
        }));
    }

    setCurrentLanguageId(languageId): void {
        this.choosenLanguage = languageId;
        this.currentLanguageIdChanged.next(languageId);
    }
}
