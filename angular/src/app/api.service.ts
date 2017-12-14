import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ApiService {
    private host = 'http://192.168.0.139:3000/api';
    private accessToken: string;

    constructor(private http: HttpClient) {
    }

    get<T>(endpoint: string, params: Object = {}): Observable<T> {
        return this.http.get<T>(this.createUrl(endpoint, params));
    }

    post<T>(endpoint: string, data: any, params: Object = {}): Observable<T> {
        return this.http.post<T>(this.createUrl(endpoint, params), data);
    }

    private createUrl(endpoint: string, params: Object ): string {
        let url = this.host + endpoint;
        /*let value: any;
        for (const key of Object.keys(params)) {
             value = params[key];
             if (typeof value === 'number') {
                 value = value.toString();
             } else if (typeof value === 'object') {
                 value = JSON.stringify(value);
             }
        }*/
        if (this.accessToken) {
            url += '?access_token=' + this.accessToken;
        }
        return encodeURI(url);
    }

    setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
    }
}