import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import { tap } from 'rxjs/operators';

import { environment } from '../environments/environment'

declare var location: any;

@Injectable()
export class ApiService {
    private host: string = null;
    private accessToken: string = null;

    private languages = null;
    private languaInfo = null;

    constructor(private http: HttpClient) {
        this.host =  location.protocol + '//' + environment.apiUrl;
    }

    get<T>(endpoint: string, params: Object = {}): Observable<T> {
        return this.http.get<T>(this.createUrl(endpoint, params));
    }

    post<T>(endpoint: string, data: any, params: Object = {}): Observable<T> {
        return this.http.post<T>(this.createUrl(endpoint, params), data);
    }

    private createUrl(endpoint: string, params: Object ): string {
        let url = this.host + endpoint;
        let query = '';
        let value: any;
        for (const key in params) {
             if (query === '') {
                 query = '?';
             } else {
                 query += '&';
             }
             value = params[key];
             if (typeof value === 'number') {
                 value = value.toString();
             } else if (typeof value === 'object') {
                 value = JSON.stringify(value);
             }
             query += key + '=' + value;
        }
        if (this.accessToken) {
            query += (query === '') ? '?' : '&';
            query += 'access_token=' + this.accessToken;
        }
        return encodeURI(url + query);
    }

    setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    clearAccessToken() {
        this.accessToken = null;
    }

    resetAccessToken() {
        this.accessToken = null;
    }

    getLanguaInfo(): Promise<any> {
        if (this.languaInfo) {
            return Promise.resolve(this.languaInfo);
        } else {
            return this.get<any>('/Languages/info').toPromise();
        }
    }

    getLanguages(): Promise<any> {
        if (this.languages) {
            return Promise.resolve(this.languages);
        } else {
            return this.get('/Languages', { filter: { where: { id: { neq: 3 } } } }).pipe(
                tap(languages => {
                    this.languages = languages;
                })
            ).toPromise();
        }
    }

    getLanguageById(id: number): Promise<any> {
        function findById(id: number) {
            return function(element, index, array) {
                return (element.id === id);
            }
        }
        if (this.languages) {
            return Promise.resolve(this.languages.find(findById(id)));
        } else {
            return new Promise((resolve, reject) => {
                this.getLanguages().then(languages => {
                    resolve(languages.find(findById(id)));
                });
            });
        }
    }
}
